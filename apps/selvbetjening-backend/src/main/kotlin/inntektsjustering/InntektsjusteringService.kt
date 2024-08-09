package no.nav.etterlatte.inntektsjustering

import no.nav.etterlatte.kafka.KafkaProdusent
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.helse.rapids_rivers.JsonMessage
import java.util.UUID

class InntektsjusteringService(
	val inntektsjusteringRepository: InntektsjusteringRepository,
	val produsent: KafkaProdusent<String, String>
) {

	fun hentInntektsjustering(fnr: Foedselsnummer): Inntektsjustering? {
		return inntektsjusteringRepository.hentInntektsjustering(fnr)
	}

	fun lagreInntektsjustering(fnr: Foedselsnummer, request: InntektsjusteringLagre) {
		inntektsjusteringRepository.lagreInntektsjustering(fnr, request)
		val message =
			JsonMessage.newMessage(
				mapOf(
					"@event_name" to "inntektsjustering",
					"aar" to "2025"
				)
			)

		produsent.publiser(UUID.randomUUID().toString(), message.toJson())
	}


}