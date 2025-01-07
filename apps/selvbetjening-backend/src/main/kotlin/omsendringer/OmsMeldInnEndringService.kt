package no.nav.etterlatte.omsendringer

import no.nav.etterlatte.libs.common.person.Foedselsnummer
import java.util.UUID

class OmsMeldInnEndringService(
    val repository: OmsMeldInnEndringRepository,
) {
    fun lagreEndringer(
        fnr: Foedselsnummer,
        request: OmsMeldtInnEndringRequest,
    ) {
        repository.lagreEndringer(
            OmsMeldtInnEndring(
                fnr = fnr,
                type = request.type,
                endringer = request.endringer,
            ),
        )
    }

    fun hentEndringerMedStatus(lagret: OmsMeldtInnEndringStatus): List<OmsMeldtInnEndring> {
        TODO()
    }

    fun oppdaterStatusForId(
        id: UUID,
        status: OmsMeldtInnEndringStatus,
    ) {
        TODO()
    }
}