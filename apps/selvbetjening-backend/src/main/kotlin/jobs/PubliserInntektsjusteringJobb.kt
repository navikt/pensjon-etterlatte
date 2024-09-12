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
                    publiserInntektsjusteringer()
                }
            }
        }
    }

    private fun publiserInntektsjusteringer() {
        runCatching {
            val inntektsjusteringer =
                inntektsjusteringService.hentSisteInntektsjusteringForStatus(
                    PubliserInntektsjusteringStatus.LAGRET,
                )

            inntektsjusteringer.forEach { inntektsjustering ->
                publiser(inntektsjustering)
            }

            // Rydder opp duplikater
            inntektsjusteringService.oppdaterDuplikateInntektsjusteringer(
                PubliserInntektsjusteringStatus.LAGRET,
                PubliserInntektsjusteringStatus.IKKE_PUBLISERT,
            )
        }.onFailure { e ->
            logger.error("Feil oppsto under jobb for publisering av inntektsjusteringer: ", e)
        }
    }

    private fun publiser(data: Map<String, Any>) {
        val fnr = data["@fnr"] as String
        val inntektsjustering = data["@inntektsjustering"] as Inntektsjustering

        runCatching {
            val melding = opprettMelding(fnr, inntektsjustering)
            produsent.publiser(UUID.randomUUID().toString(), melding.toJson())

            inntektsjusteringService.oppdaterStatusForInntektsjustering(
                inntektsjustering.id,
                PubliserInntektsjusteringStatus.PUBLISERT,
            )
            logger.info("Inntektsjustering publisert og oppdatert id: ${inntektsjustering.id}")
        }.onFailure { e ->
            logger.error(
                "Feil oppsto under publisering av inntektsjustering for id: ${inntektsjustering.id}",
                e,
            )
        }
    }

    private fun opprettMelding(
        fnr: String,
        inntektsjustering: Inntektsjustering,
    ): JsonMessage =
        JsonMessage.newMessage(
            mapOf(
                "@event_name" to "inntektsjustering_innsendt",
                "@fnr_bruker" to fnr,
                "@inntektsjustering_innhold" to inntektsjustering.toJson(),
            ),
        )
}

enum class PubliserInntektsjusteringStatus(
    val value: String,
) {
    LAGRET("LAGRET"),
    PUBLISERT("PUBLISERT"),
    IKKE_PUBLISERT("IKKE_PUBLISERT"),
}