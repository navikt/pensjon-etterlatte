package no.nav.etterlatte.jobs

import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.inntektsjustering.InntektsjusteringService
import no.nav.etterlatte.kafka.KafkaProdusent
import no.nav.etterlatte.libs.common.inntektsjustering.Inntektsjustering
import no.nav.etterlatte.shuttingDown
import no.nav.etterlatte.toJson
import no.nav.helse.rapids_rivers.JsonMessage
import org.slf4j.LoggerFactory
import java.time.Duration
import java.time.temporal.ChronoUnit
import java.util.Timer
import java.util.UUID
import kotlin.concurrent.fixedRateTimer

class PubliserInntektsjusteringJobb(
    private val produsent: KafkaProdusent<String, String>,
    private val inntektsjusteringService: InntektsjusteringService,
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
                        val resultat =
                            inntektsjusteringService.hentSisteInntektsjusteringForStatus(
                                PubliserInntektsjusteringStatus.LAGRET,
                            )

                        resultat.forEach {
                            try {
                                val fnr = it["@fnr"] as String
                                val inntektsjustering = it["@inntektsjustering"] as Inntektsjustering

                                val message =
                                    JsonMessage.newMessage(
                                        mapOf(
                                            "@event_name" to "inntektsjustering_innsendt",
                                            "@fnr_bruker" to fnr,
                                            "@inntektsjustering_innhold" to
                                                inntektsjustering.toJson(),
                                        ),
                                    )

                                produsent.publiser(UUID.randomUUID().toString(), message.toJson())
                                inntektsjusteringService.oppdaterStatusForInntektsjustering(
                                    inntektsjustering.id,
                                    PubliserInntektsjusteringStatus.PUBLISERT,
                                )
                            } catch (e: Exception) {
                                logger.error("Feil oppsto under publisering av inntektsjustering: ", e)
                            }
                        }

                        // rydder opp eventuelle duplikater
                        inntektsjusteringService.oppdaterDuplikaterInntektsjustering(
                            PubliserInntektsjusteringStatus.LAGRET,
                            PubliserInntektsjusteringStatus.IKKE_PUBLISERT,
                        )
                    } catch (e: Exception) {
                        logger.error("Feil oppsto under publisering av inntektsjusteringer jobb: ", e)
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