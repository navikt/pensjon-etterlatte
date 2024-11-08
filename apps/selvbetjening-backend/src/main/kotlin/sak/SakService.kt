package no.nav.etterlatte.sak

import no.nav.etterlatte.libs.common.person.Foedselsnummer

class SakService(
    private val klient: SakKlient,
) {
    suspend fun harOMSSak(fnr: Foedselsnummer): Boolean {
        val response = klient.harOMSSakIGjenny(fnr)

        return response.harOMSSak
    }
}