package no.nav.etterlatte.jobs

import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.SoeknadPubliserer
import no.nav.etterlatte.UtkastPubliserer
import no.nav.etterlatte.libs.utils.logging.CORRELATION_ID
import no.nav.etterlatte.libs.utils.logging.getCorrelationId
import no.nav.etterlatte.shuttingDown
import org.slf4j.LoggerFactory
import org.slf4j.MDC
import soeknad.LagretSoeknad
import soeknad.SoeknadRepository
import java.time.Duration
import java.time.temporal.ChronoUnit
import java.util.Timer
import kotlin.concurrent.fixedRateTimer

class PubliserTilstandJobb(
    private val db: SoeknadRepository,
    private val publiserSoeknad: SoeknadPubliserer,
    private val publiserUtkast: UtkastPubliserer,
) {
    private val logger = LoggerFactory.getLogger(PubliserTilstandJobb::class.java)

    fun schedule(): Timer {
        logger.info("Setter opp ${this.javaClass.simpleName}")

        return fixedRateTimer(
            name = this.javaClass.simpleName,
            initialDelay = Duration.of(1, ChronoUnit.MINUTES).toMillis(),
            period = Duration.of(10, ChronoUnit.MINUTES).toMillis(),
        ) {
            runBlocking {
                sjekkTilstandOgPubliser()
            }
        }
    }

    private suspend fun sjekkTilstandOgPubliser() {
        if (LeaderElection.isLeader() && !shuttingDown.get()) {
            MDC.put(CORRELATION_ID, getCorrelationId())

            logger.info("Starter tilstandssjekk")

            try {
                db.slettArkiverteSoeknader().also {
                    if (it > 0) logger.info("Slettet $it søknader(er) som var arkivert")
                }

                db.slettUtgaatteKladder().also {
                    if (it.isNotEmpty()) {
                        logger.info("Slettet ${it.size} kladd(er) som var utgått")
                        it.forEach { soeknad ->
                            publiserUtkast.publiserSlettUtkastFraMinSide(soeknad.fnr, soeknad.id)
                        }
                    }
                }

                db
                    .usendteSoeknader()
                    .also {
                        if (it.isNotEmpty()) {
                            logger.info("Publiserer melding om søknader ${it.map(LagretSoeknad::id)} ut på kafka")
                        }
                    }.forEach {
                        publiserSoeknad.publiser(it)
                    }

                db
                    .arkiverteUtenBehandlingIDoffen()
                    .also {
                        if (it.isNotEmpty()) {
                            logger.info(
                                "Publiserer melding om søknader ${it.map(LagretSoeknad::id)} som mangler " +
                                    "behandling ut på Kafka",
                            )
                        }
                    }.forEach {
                        publiserSoeknad.publiserBehandlingsbehov(it)
                    }
            } catch (e: Exception) {
                logger.error("Feil under kjøring av jobb: ", e)
            }
        }
    }
}