package no.nav.etterlatte.libs.pdl

import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.accept
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.contentType
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadType
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.finnBehandlingsnummerFromSaktype
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import org.slf4j.LoggerFactory

interface Pdl {
    suspend fun finnAdressebeskyttelseForFnr(fnrListe: List<Foedselsnummer>, saktype: SoeknadType): AdressebeskyttelseResponse
}

class AdressebeskyttelseKlient(private val client: HttpClient, private val apiUrl: String) : Pdl {
    private val logger = LoggerFactory.getLogger(AdressebeskyttelseKlient::class.java)

    /**
     * Henter personer og tilknyttet adressebeskyttelse fra PDL.
     * Dersom en person ikke har adressebeskyttelse vil personobjektet inneholde en tom liste adressebeskyttelse.
     *
     * @param fnrListe: Liste over fødselsnummer.
     *
     * @return [AdressebeskyttelseResponse]: Responsobjekt fra PDL.
     */
    override suspend fun finnAdressebeskyttelseForFnr(fnrListe: List<Foedselsnummer>, saktype: SoeknadType):
            AdressebeskyttelseResponse {

        val query = hentQuery()

        val request = GraphqlRequest(query, Variables(identer = fnrListe.map { it.value }))

        val behandlingsnummer = finnBehandlingsnummerFromSaktype(saktype).behandlingsnummer

        val response = client.post(apiUrl) {
            header(HEADER_TEMA, HEADER_TEMA_VALUE)
            header(HEADER_BEHANDLINGSNUMMER, behandlingsnummer)
            accept(ContentType.Application.Json)
            contentType(ContentType.Application.Json)
            setBody(request)
        }.body<AdressebeskyttelseResponse>()

        // Logge feil dersom det finnes noen
        response.errors?.forEach { error ->
            logger.error("Feil ved uthenting av adressebeskyttelse: ${error}")
        }

        return response
    }

    companion object {
        const val HEADER_BEHANDLINGSNUMMER = "behandlingsnummer"
        const val HEADER_TEMA = "Tema"
        const val HEADER_TEMA_VALUE = "PEN"
    }

    private fun hentQuery(): String = javaClass.getResource("/pdl/hentAdressebeskyttelse.graphql")!!
        .readText()
        .replace(System.lineSeparator(), "")
}
