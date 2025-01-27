package no.nav.etterlatte.sak

import no.nav.etterlatte.libs.common.person.Foedselsnummer

class SakService(
    private val klient: SakKlient,
) {
    suspend fun harLoependeOMSSak(fnr: Foedselsnummer): Boolean {
        val response = klient.harOMSLoependeSakIGjenny(fnr)

        return response.harOMSSak
    }
}