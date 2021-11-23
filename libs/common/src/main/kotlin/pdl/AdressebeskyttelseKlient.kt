package no.nav.etterlatte.libs.common.pdl

import io.ktor.client.HttpClient
import io.ktor.client.request.accept
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.http.ContentType
import io.ktor.http.contentType
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import org.slf4j.LoggerFactory

interface Pdl {
    suspend fun finnAdressebeskyttelseForFnr(fnrListe: List<Foedselsnummer>): AdressebeskyttelseResponse
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
    override suspend fun finnAdressebeskyttelseForFnr(fnrListe: List<Foedselsnummer>): AdressebeskyttelseResponse {
        val query = hentQuery()

        val request = GraphqlRequest(query, Variables(identer = fnrListe.map { it.value }))

        val response = client.post<AdressebeskyttelseResponse>(apiUrl) {
            header("Tema", "PEN")
            accept(ContentType.Application.Json)
            contentType(ContentType.Application.Json)
            body = request
        }

        // Logge feil dersom det finnes noen
        response.errors?.forEach { error ->
            logger.error("Feil ved uthenting av adressebeskyttelse", error.toString())
        }

        return response
    }

    private fun hentQuery(): String = javaClass.getResource("/pdl/hentAdressebeskyttelse.graphql")!!
        .readText()
        .replace(System.lineSeparator(), "")
}
