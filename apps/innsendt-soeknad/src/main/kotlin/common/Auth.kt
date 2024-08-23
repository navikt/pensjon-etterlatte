package no.nav.etterlatte.common

import no.nav.etterlatte.ktortokenexchange.ThreadBoundSecurityContext
import no.nav.etterlatte.libs.common.person.Foedselsnummer

class Auth {
    companion object {
        fun innloggetBrukerFnr() = Foedselsnummer.of(ThreadBoundSecurityContext.get().user())
    }
}