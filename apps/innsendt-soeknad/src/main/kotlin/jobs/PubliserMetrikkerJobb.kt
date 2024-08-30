package no.nav.etterlatte.jobs

import io.micrometer.core.instrument.Gauge
import io.micrometer.prometheusmetrics.PrometheusMeterRegistry
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.internal.Metrikker
import no.nav.etterlatte.shuttingDown
import org.slf4j.LoggerFactory
import soeknad.StatistikkRepository
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
                        publiserMetrikker()
                    } catch (e: Exception) {
                        logger.error("Feil oppsto under oppretting av rapport/metrikker: ", e)
                    }
                }
            }
        }
    }

    internal fun publiserMetrikker() {
        db.eldsteUsendte()?.apply {
            Gauge
                .builder("alder_eldste_usendte") { ChronoUnit.MINUTES.between(this, LocalDateTime.now()).toDouble() }
                .description("Alder på elste usendte søknad")
                .register(registry)
        }
        db.eldsteUarkiverte()?.apply {
            Gauge
                .builder("alder_eldste_uarkiverte") { ChronoUnit.MINUTES.between(this, LocalDateTime.now()).toDouble() }
                .description("Alder på eldste ikke-arkiverte søknad")
                .register(registry)
        }

        db
            .rapport()
            .also { rapport -> logger.info(rapport.toString()) }
            .forEach { (status, kilde, antall) ->
                Gauge
                    .builder("soknad_tilstand") { antall.toDouble() }
                    .description("Tilstanden søknader er i")
                    .tag("tilstand", status.name)
                    .tag("kilde", kilde)
                    .register(registry)
            }

        db
            .kilder()
            .also { kilde -> logger.info(kilde.toString()) }
            .forEach { (kilde, antall) ->
                Gauge
                    .builder("soknad_kilde") { antall.toDouble() }
                    .description("Kilden søknadene er fra")
                    .tag("kilde", kilde)
                    .register(registry)
            }

        logger.info("Ukategoriserte søknader: " + db.ukategorisert().toString())
    }
}