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
    registry: PrometheusMeterRegistry = Metrikker.registry,
) {
    private val logger = LoggerFactory.getLogger(PubliserMetrikkerJobb::class.java)

    init {
        Gauge.builder("alder_eldste_usendte") {
            db.eldsteUsendte()?.let {
                ChronoUnit.MINUTES.between(it, LocalDateTime.now()).toDouble()
            } ?: 0
        }
            .description("Alder på eldste usendte søknad")
            .register(registry)

        Gauge.builder("alder_eldste_uarkiverte") {
            db.eldsteUarkiverte()?.let {
                ChronoUnit.MINUTES.between(it, LocalDateTime.now()).toDouble()
            } ?: 0
        }
            .description("Alder på eldste ikke-arkiverte søknad")
            .register(registry)

        Gauge.builder("soknader_lagretkladd") {
            db.soeknaderMedHendelseStatus(Status.LAGRETKLADD)
                .also { antall -> logger.info("Hentet $antall søknader som har blitt lagret som kladd") }
                ?.toDouble()
                ?: 0
        }
            .description("Søknader som har vært lagret som kladd")
            .register(registry)

        Gauge
            .builder("soknader_ferdigstilt") {
                db.soeknaderMedHendelseStatus(Status.FERDIGSTILT)
                    .also { antall -> logger.info("Hentet $antall søknader som har blitt ferdigstilt") }
                    ?.toDouble()
                    ?: 0
            }
            .description("Søknader som har vært lagret som ferdigstilt")
            .register(registry)

        Gauge
            .builder("ferdigstillelsesgrad") {
                db.ferdigstillelsesgradSiste30dagerProsent()
                    .also { grad -> logger.info("Hentet ferdigstillelsesgrad: $grad ") }
            }
            .description("Hvor stor andel av søknader som har blitt ferdigstilt vs lagret kladd de siste 30 dager")
            .register(registry)
    }

    private val soknadTilstand = MultiGauge
        .builder("soknad_tilstand")
        .description("Tilstanden søknader er i")
        .register(registry)
    private val soknadKilde = MultiGauge
        .builder("soknad_kilde")
        .description("Kilden søknadene er fra")
        .register(registry)


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
                        oppdaterMultiGauges()
                    } catch (e: Exception) {
                        logger.error("Feil oppsto under oppretting av rapport/metrikker: ", e)
                    }
                }
            }
        }
    }

    internal fun oppdaterMultiGauges() {
        soknadKilde.register(
            db.kilder()
                .also { logger.info("Fant kilder: $it") }
                .map { (kilde, antall) ->
                    Row.of(Tags.of("kilde", kilde), antall)
                },
            true
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
                },
            true
        )
    }
}