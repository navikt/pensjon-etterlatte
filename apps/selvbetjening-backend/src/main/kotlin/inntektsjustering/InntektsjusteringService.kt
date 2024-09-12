package no.nav.etterlatte.inntektsjustering

import no.nav.etterlatte.jobs.PubliserInntektsjusteringStatus
import no.nav.etterlatte.libs.common.inntektsjustering.Inntektsjustering
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import java.util.UUID

class InntektsjusteringService(
    val inntektsjusteringRepository: InntektsjusteringRepository,
) {
    fun hentInntektsjusteringForFnr(fnr: Foedselsnummer): Inntektsjustering? =
        inntektsjusteringRepository.hentInntektsjusteringForFnr(fnr)

    fun hentSisteInntektsjusteringForStatus(status: PubliserInntektsjusteringStatus) =
        inntektsjusteringRepository.hentSisteInntektsjusteringForStatus(status)

    fun lagreInntektsjustering(
        fnr: Foedselsnummer,
        request: InntektsjusteringLagre,
    ) {
        inntektsjusteringRepository.lagreInntektsjustering(fnr, request)
    }

    fun oppdaterDuplikaterInntektsjustering(
        status: PubliserInntektsjusteringStatus,
        updateStatus: PubliserInntektsjusteringStatus,
    ) {
        inntektsjusteringRepository.oppdaterDuplikaterStatus(status, updateStatus)
    }

    fun oppdaterStatusForInntektsjustering(
        id: UUID,
        status: PubliserInntektsjusteringStatus,
    ) {
        inntektsjusteringRepository.oppdaterInntektsjusteringStatus(id, status)
    }
}