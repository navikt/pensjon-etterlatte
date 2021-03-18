package no.nav.etterlatte.person

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonInclude
import io.ktor.client.HttpClient
import io.ktor.client.request.header
import io.ktor.client.request.post

class PersonClient(
    private val httpClient: HttpClient
) {

    suspend fun hentPerson(fnr: String): Person {
        val query = javaClass.getResource("/pdl/hentPerson.graphql").readText().replace(Regex("[\n\t]"), "")

        val request = GraphqlRequest(query, Variables(ident = fnr))

        // TODO: Opprette et GraphQL-objekt for å håndtere responsen
        /*
        val hentPerson = httpClient.post<String>("https://etterlatte-proxy.dev-fss-pub.nais.io/pdl") {
            header("Tema", "PEN")
            header("Accept", "application/json")
            header("Authorization", "Bearer ${token}")
            body = request
        }
        */

        return Person(
            fornavn = "Test",
            etternavn = "Testesen",
            bostedsadresse = "Testveien 123, 0123 Oslo",
            telefonnummer = "99988877",
            epost = "test@nav.no",
            statsborgerskap = "NO"
        )
    }

}

private data class GraphqlRequest(
    val query: String,
    val variables: Variables
)

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
private data class Variables(val ident: String)