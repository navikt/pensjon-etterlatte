package no.nav.etterlatte.no.nav.etterlatte.endringer

import no.nav.etterlatte.endringer.Endringer
import no.nav.etterlatte.endringer.EndringerRequest
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.no.nav.etterlatte.no.nav.etterlatte.endringer.EndringerRepository
import java.time.Instant
import java.util.UUID

class EndringerService(
    val repository: EndringerRepository,
) {
    fun lagreEndringer(
        fnr: Foedselsnummer,
        request: EndringerRequest,
    ) {
        repository.lagreEndringer(
            Endringer(
                id = UUID.randomUUID(),
                fnr = fnr,
                type = request.type,
                endringer = request.endringer,
                tidspunkt = Instant.now(),
            ),
        )
    }
}