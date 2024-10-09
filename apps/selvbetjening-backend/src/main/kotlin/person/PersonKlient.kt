package no.nav.etterlatte.person

import io.ktor.client.HttpClient
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import org.slf4j.LoggerFactory

class PersonKlient(
    private val httpClient: HttpClient,
) {
    private val logger = LoggerFactory.getLogger(PersonKlient::class.java)

    companion object {
        private const val TEMA = "PEN"
        private const val BEHANDLINGSNUMMER = "behandlingsnummer"
    }

    suspend fun hentPerson(fnr: Foedselsnummer)
}