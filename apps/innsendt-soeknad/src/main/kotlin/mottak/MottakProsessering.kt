package no.nav.etterlatte.mottak

import efterlatte.prosessering.ProcessingEngine
import efterlatte.prosessering.Reaper
import efterlatte.prosessering.StandardTaskProdusent
import efterlatte.prosessering.TaskProdusent
import efterlatte.prosessering.TaskStep
import efterlatte.prosessering.postgres.JdbcTransaksjon
import efterlatte.prosessering.postgres.PostgresTaskRepository
import io.ktor.server.application.Application
import io.ktor.server.application.ApplicationStarted
import io.ktor.server.application.ApplicationStopPreparing
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.funksjonsbrytere.FeatureToggle
import no.nav.etterlatte.funksjonsbrytere.FeatureToggleService
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadType
import org.slf4j.LoggerFactory
import soeknad.SoeknadID
import java.sql.Connection
import java.util.concurrent.atomic.AtomicBoolean
import javax.sql.DataSource
import kotlin.time.Duration
import kotlin.time.Duration.Companion.seconds

enum class MottakToggle(
    private val key: String,
) : FeatureToggle {
    /** Nye utvidet OMS-søknader tildeles prosesseringsløpet. Av betyr Kafka-løpet. Påvirker aldri påbegynte mottak. */
    UTVIDET_OMS_PROSESSERING("pensjon-etterlatte.innsendt-soeknad.utvidet-oms-mottak-prosessering"),
    ;

    override fun key() = key
}

/** Avgjør mottaksflyt for nye søknader og legger første task på søknadens transaksjon. */
interface MottakStarter {
    fun skalBrukeProsessering(type: SoeknadType?): Boolean

    fun start(
        c: Connection,
        soeknadId: SoeknadID,
        type: SoeknadType,
    )
}

/** Brukes når prosesseringsløpet ikke er konfigurert, som i prod. Alle søknader går til Kafka-løpet. */
object KunKafkaMottak : MottakStarter {
    override fun skalBrukeProsessering(type: SoeknadType?) = false

    override fun start(
        c: Connection,
        soeknadId: SoeknadID,
        type: SoeknadType,
    ): Unit = error("Prosesseringsløpet er ikke konfigurert")
}

class ProsesseringMottakStarter(
    private val produsent: TaskProdusent,
    private val mottakDao: SoeknadMottakDao,
    private val toggles: FeatureToggleService,
) : MottakStarter {
    override fun skalBrukeProsessering(type: SoeknadType?) =
        type == SoeknadType.UTVIDET_OMSTILLINGSSTOENAD &&
            toggles.isEnabled(MottakToggle.UTVIDET_OMS_PROSESSERING, defaultValue = false)

    override fun start(
        c: Connection,
        soeknadId: SoeknadID,
        type: SoeknadType,
    ) {
        mottakDao.opprett(c, soeknadId, type)
        produsent.opprett(
            transaksjon = JdbcTransaksjon(c),
            type = MottakTasks.HENT_JOURNALFOERINGSKONTEKST,
            payload = SoeknadTaskPayload(soeknadId),
            metadata = MottakTasks.metadata(soeknadId, soeknadType = type.name),
        )
    }
}

/**
 * Motoren og reaperen for mottakstasks. Lav samtidighet, slik at connection-poolen fortsatt har plass
 * til API-et og jobbene. Startes når Ktor er startet (etter Flyway) og stoppes før Ktor stopper.
 */
class MottakProsessering(
    dataSource: DataSource,
    steg: List<TaskStep<*>>,
    node: String,
    pollIntervall: Duration = 2.seconds,
) {
    private val logger = LoggerFactory.getLogger(this::class.java)

    val repository = PostgresTaskRepository(dataSource)
    val produsent: TaskProdusent = StandardTaskProdusent(repository)

    private val engine =
        ProcessingEngine(
            repo = repository,
            produsent = produsent,
            steg = steg,
            node = node,
            batchStorrelse = 5,
            maxSamtidighet = MAKS_SAMTIDIGHET,
            pollIntervall = pollIntervall,
        )
    private val reaper = Reaper(repo = repository, node = node)

    fun installer(application: Application) {
        application.monitor.subscribe(ApplicationStarted) { start() }
        application.monitor.subscribe(ApplicationStopPreparing) { stopp() }
    }

    private val startet = AtomicBoolean(false)

    fun start() {
        if (!startet.compareAndSet(false, true)) return
        logger.info("Starter prosessering for søknadsmottak")
        engine.start()
        reaper.start()
    }

    fun stopp() {
        if (!startet.compareAndSet(true, false)) return
        logger.info("Stopper prosessering for søknadsmottak")
        runBlocking {
            engine.stop()
            reaper.stop()
        }
    }

    companion object {
        const val MAKS_SAMTIDIGHET = 2
    }
}