package no.nav.etterlatte.person

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.databind.node.ObjectNode
import io.ktor.client.HttpClient
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.content.TextContent
import io.ktor.http.ContentType
import no.nav.etterlatte.common.toJson
import org.slf4j.LoggerFactory

interface PersonKlient {
    suspend fun hentPerson(fnr: String): Person
}

class PersonService(
    private val uri: String,
    private val httpClient: HttpClient
): PersonKlient {
    private val logger = LoggerFactory.getLogger(PersonKlient::class.java)

    companion object {
        private const val TEMA = "PEN"
    }

    override suspend fun hentPerson(fnr: String): Person {
        val query = javaClass.getResource("/pdl/hentPerson.graphql").readText().replace(Regex("[\n\t]"), "")

        val request = GraphqlRequest(query, Variables(ident = fnr))

        val hentPerson = httpClient.post<ObjectNode>(uri) {
            header("Tema", TEMA)
            header("Accept", "application/json")
            body = TextContent(request.toJson(), ContentType.Application.Json)
        }

        logger.info("Fant person: ${hentPerson.toPrettyString()}")

        return Person(
            fornavn = "Test",
            etternavn = "Testesen",
            fødselsnummer = fnr,
            adresse = "Testveien 123, 0123 Oslo",
            statsborgerskap = "NO",
            sivilstatus = "Gift"
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