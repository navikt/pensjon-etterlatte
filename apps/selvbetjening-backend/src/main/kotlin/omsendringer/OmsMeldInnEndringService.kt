package no.nav.etterlatte.omsendringer

import no.nav.etterlatte.libs.common.person.Foedselsnummer

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
}