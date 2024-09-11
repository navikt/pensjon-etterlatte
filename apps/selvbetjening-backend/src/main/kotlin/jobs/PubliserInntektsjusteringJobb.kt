package no.nav.etterlatte.jobs

import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.inntektsjustering.InntektsjusteringService
import no.nav.etterlatte.kafka.KafkaProdusent
import no.nav.etterlatte.shuttingDown
import org.slf4j.LoggerFactory
import java.time.Duration
import java.time.temporal.ChronoUnit
import java.util.Timer
import kotlin.concurrent.fixedRateTimer

class PubliserInntektsjusteringJobb(
    private val produsent: KafkaProdusent<String, String>,
    private val service: InntektsjusteringService,
) {
    private val logger = LoggerFactory.getLogger(PubliserInntektsjusteringJobb::class.java)

    fun schedule(): Timer {
        logger.info("Setter opp ${this.javaClass.simpleName}")

        return fixedRateTimer(
            name = this.javaClass.simpleName,
            initialDelay = Duration.of(60, ChronoUnit.MINUTES).toMillis(),
            period = Duration.of(15, ChronoUnit.MINUTES).toMillis(),
        ) {
            runBlocking {
                if (LeaderElection.isLeader() && !shuttingDown.get()) {
                    try {
                        /*val lagret = service.hentInntektsjusteringForFnr(fnr)
                        val message =
                            JsonMessage.newMessage(
                                mapOf(
                                    "@event_name" to "inntektsjustering_innsendt",
                                    "@fnr_bruker" to fnr.value,
                                    "@inntektsjustering_innhold" to lagret!!.toJson(),
                                ),
                            )

                        produsent.publiser(UUID.randomUUID().toString(), message.toJson())
                         */
                    } catch (e: Exception) {
                        logger.error("Feil oppsto under publisering av inntektsjustering: ", e)
                    }
                }
            }
        }
    }
}

enum class PubliserInntektsjusteringStatus(
    val value: String,
) {
    LAGRET("LAGRET"),
    PUBLISERT("PUBLISERT"),
    IKKE_PUBLISERT("IKKE_PUBLISERT"),
    ;

    companion object {
        fun fra(value: String): PubliserInntektsjusteringStatus? = entries.find { it.value == value }
    }
}