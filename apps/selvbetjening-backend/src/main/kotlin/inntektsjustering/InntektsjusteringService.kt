package no.nav.etterlatte.inntektsjustering

import no.nav.etterlatte.kafka.KafkaProdusent
import no.nav.etterlatte.libs.common.inntektsjustering.Inntektsjustering
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.toJson
import no.nav.helse.rapids_rivers.JsonMessage
import java.util.UUID

class InntektsjusteringService(
    val inntektsjusteringRepository: InntektsjusteringRepository,
    val produsent: KafkaProdusent<String, String>,
) {
    fun hentInntektsjustering(fnr: Foedselsnummer): Inntektsjustering? =
        inntektsjusteringRepository.hentInntektsjustering(fnr)

    fun lagreInntektsjustering(
        fnr: Foedselsnummer,
        request: InntektsjusteringLagre,
    ) {
        inntektsjusteringRepository.lagreInntektsjustering(fnr, request)
        val lagret = inntektsjusteringRepository.hentInntektsjustering(fnr)
        val message =
            JsonMessage.newMessage(
                mapOf(
                    "@event_name" to "inntektsjustering_innsendt",
                    "@fnr_bruker" to fnr.value,
                    "@inntektsjustering_innhold" to lagret!!.toJson(),
                ),
            )

        produsent.publiser(UUID.randomUUID().toString(), message.toJson())
    }
}