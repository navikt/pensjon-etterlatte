package no.nav.etterlatte.inntektsjustering

class InntektsjusteringService(
	val inntektsjusteringRepository: InntektsjusteringRepository
) {

	fun hentInntektsjustering(fnr: String): Inntektsjustering? {
		return inntektsjusteringRepository.hentInntektsjustering(fnr)
	}


}