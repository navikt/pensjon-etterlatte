package no.nav.etterlatte.inntektsjustering

import no.nav.etterlatte.libs.common.inntektsjustering.Inntektsjustering
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import java.util.UUID

class InntektsjusteringService(
    val inntektsjusteringRepository: InntektsjusteringRepository,
) {
    fun hentInntektsjusteringForFnr(fnr: Foedselsnummer): Inntektsjustering? =
        inntektsjusteringRepository.hentInntektsjusteringForFnr(fnr)

    fun hentInntektsjusteringForStatus(status: InntektsjusteringStatus) =
        inntektsjusteringRepository.hentAlleInntektsjusteringerForStatus(status)

    fun lagreInntektsjustering(
        fnr: Foedselsnummer,
        request: InntektsjusteringLagre,
    ) {
        val lagretInntektsjustering =
            inntektsjusteringRepository.hentInntektsjusteringForFnrOgStatus(
                fnr,
                InntektsjusteringStatus.LAGRET,
            )

        if (lagretInntektsjustering == null) {
            inntektsjusteringRepository.lagreInntektsjustering(fnr, request)
        } else {
            inntektsjusteringRepository.oppdaterInntektsjustering(lagretInntektsjustering.id, request)
        }
    }

    fun oppdaterStatusForId(
        id: UUID,
        status: InntektsjusteringStatus,
    ) {
        inntektsjusteringRepository.oppdaterStatusForId(id, status)
    }
}