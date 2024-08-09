package no.nav.etterlatte.inntektsjustering

import no.nav.etterlatte.libs.common.person.Foedselsnummer

class InntektsjusteringService(
	val inntektsjusteringRepository: InntektsjusteringRepository
) {

	fun hentInntektsjustering(fnr: Foedselsnummer): Inntektsjustering? {
		return inntektsjusteringRepository.hentInntektsjustering(fnr)
	}

	fun lagreInntektsjustering(fnr: Foedselsnummer, request: InntektsjusteringLagre) {
		inntektsjusteringRepository.lagreInntektsjustering(fnr, request)
	}


}