package no.nav.etterlatte.jobs

import io.micrometer.core.instrument.Gauge
import io.micrometer.core.instrument.MultiGauge
import io.micrometer.core.instrument.MultiGauge.Row
import io.micrometer.core.instrument.Tags
import io.micrometer.prometheusmetrics.PrometheusMeterRegistry
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.internal.Metrikker
import no.nav.etterlatte.shuttingDown
import org.slf4j.LoggerFactory
import soeknad.StatistikkRepository
import soeknad.Status
import java.time.Duration
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit
import java.util.Timer
import kotlin.concurrent.fixedRateTimer


class PubliserMetrikkerJobb(
    private val db: StatistikkRepository,
    private val registry: PrometheusMeterRegistry = Metrikker.registry,
) {
    private val logger = LoggerFactory.getLogger(PubliserMetrikkerJobb::class.java)

    private lateinit var alderEldsteUsendte: Gauge
    private lateinit var alderEldsteUarkiverte: Gauge
    private lateinit var soknaderLagretKladd: Gauge
    private lateinit var soknaderFerdigstilt: Gauge
    private lateinit var soknadTilstand: MultiGauge
    private lateinit var soknadKilde: MultiGauge

    fun schedule(): Timer {
        logger.info("Setter opp ${this.javaClass.simpleName}")

        return fixedRateTimer(
            name = this.javaClass.simpleName,
            initialDelay = Duration.of(1, ChronoUnit.MINUTES).toMillis(),
            period = Duration.of(15, ChronoUnit.MINUTES).toMillis(),
        ) {
            runBlocking {
                if (LeaderElection.isLeader() && !shuttingDown.get()) {
                    try {
                        publiserOgOppdaterMetrikker()
                    } catch (e: Exception) {
                        logger.error("Feil oppsto under oppretting av rapport/metrikker: ", e)
                    }
                }
            }
        }
    }

    internal fun publiserOgOppdaterMetrikker() {
        publiserMetrikker()
        oppdaterMultiGauges()
    }

    /**
     * Publiserer metrikker, men bare hvis de ikke allerede er publiserte.
     */
    private fun publiserMetrikker() {
        if (!this::alderEldsteUsendte.isInitialized) {
            alderEldsteUsendte = Gauge
                .builder("alder_eldste_usendte") {
                    db.eldsteUsendte()?.let {
                        ChronoUnit.MINUTES.between(it, LocalDateTime.now()).toDouble()
                    }
                }
                .description("Alder på eldste usendte søknad")
                .register(registry)
        }

        if (!this::alderEldsteUarkiverte.isInitialized) {
            alderEldsteUarkiverte = Gauge
                .builder("alder_eldste_uarkiverte") {
                    db.eldsteUarkiverte()?.let {
                        ChronoUnit.MINUTES.between(it, LocalDateTime.now()).toDouble()
                    }
                }
                .description("Alder på eldste ikke-arkiverte søknad")
                .register(registry)
        }

        if (!this::soknadTilstand.isInitialized) {
            soknadTilstand = MultiGauge
                .builder("soknad_tilstand")
                .description("Tilstanden søknader er i")
                .register(registry)
        }

        if (!this::soknadKilde.isInitialized) {
            soknadKilde = MultiGauge
                .builder("soknad_kilde")
                .description("Kilden søknadene er fra")
                .register(registry)
        }

        if (!this::soknaderLagretKladd.isInitialized) {
            soknaderLagretKladd =
                Gauge
                    .builder("soknader_lagretkladd") {
                        db.soeknaderMedHendelseStatus(Status.LAGRETKLADD)
                            .also { antall -> logger.info("Hentet $antall søknader som har blitt lagret som kladd") }
                            ?.toDouble()
                    }
                    .description("Søknader som har vært lagret som kladd")
                    .register(registry)
        }

        if (!this::soknaderFerdigstilt.isInitialized) {
            soknaderFerdigstilt =
                Gauge
                    .builder("soknader_ferdigstilt") {
                        db.soeknaderMedHendelseStatus(Status.FERDIGSTILT)
                            .also { antall -> logger.info("Hentet $antall søknader som har blitt ferdigstilt") }
                            ?.toDouble()
                    }
                    .description("Søknader som har vært lagret som ferdigstilt")
                    .register(registry)

        }
    }

    private fun oppdaterMultiGauges() {
        soknadKilde.register(
            db.kilder()
                .also { logger.info("Fant kilder: $it") }
                .map { (kilde, antall) ->
                    Row.of(Tags.of("kilde", kilde), antall)
                }
        )
        soknadTilstand.register(
            db.rapport()
                .also { logger.info("Fant tilstander: $it") }
                .map {
                    Row.of(
                        Tags.of(
                            "tilstand", it.status.name,
                            "kilde", it.kilde
                        ),
                        it.count
                    )
                }
        )
    }
}