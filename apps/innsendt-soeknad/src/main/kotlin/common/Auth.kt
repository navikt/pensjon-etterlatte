package no.nav.etterlatte.common

import io.ktor.auth.ThreadBoundSecCtx
import no.nav.etterlatte.libs.common.person.Foedselsnummer

class Auth {
    companion object {
        fun innloggetBrukerFnr() = Foedselsnummer.of(ThreadBoundSecCtx.get().user())
    }
}