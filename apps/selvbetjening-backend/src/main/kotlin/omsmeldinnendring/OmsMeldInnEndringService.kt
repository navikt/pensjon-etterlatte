package no.nav.etterlatte.omsendringer

import no.nav.etterlatte.libs.common.omsmeldinnendring.OmsMeldtInnEndring
import no.nav.etterlatte.libs.common.omsmeldinnendring.OmsMeldtInnEndringStatus
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import java.util.UUID

class OmsMeldInnEndringService(
    private val repository: OmsMeldInnEndringRepository,
) {
    fun lagreEndringer(
        fnr: Foedselsnummer,
        request: OmsMeldtInnEndringRequest,
    ) {
        repository.lagreEndringer(
            OmsMeldtInnEndring(
                fnr = fnr,
                endring = request.endring,
                beskrivelse = request.beskrivelse,
            ),
        )
    }

    fun hentEndringerMedStatus(lagret: OmsMeldtInnEndringStatus) = repository.hentEndringerMedStatus(lagret)

    fun oppdaterStatusForId(
        id: UUID,
        status: OmsMeldtInnEndringStatus,
    ) {
        repository.oppdaterStatusForId(id, status)
    }
}