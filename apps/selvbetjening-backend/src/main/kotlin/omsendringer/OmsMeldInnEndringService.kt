package no.nav.etterlatte.omsendringer

import no.nav.etterlatte.libs.common.person.Foedselsnummer
import java.time.Instant
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
                id = UUID.randomUUID(),
                fnr = fnr,
                type = request.type,
                endringer = request.endringer,
                tidspunkt = Instant.now(),
            ),
        )
    }
}