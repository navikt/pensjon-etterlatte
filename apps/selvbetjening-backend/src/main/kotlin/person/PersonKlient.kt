package no.nav.etterlatte.person

import com.fasterxml.jackson.databind.node.ObjectNode
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.accept
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.content.TextContent
import libs.common.util.unsafeRetry
import no.nav.etterlatte.common.mapJsonToAny
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.libs.utils.logging.X_CORRELATION_ID
import no.nav.etterlatte.libs.utils.logging.getCorrelationId
import no.nav.etterlatte.pdl.GraphqlRequest
import no.nav.etterlatte.pdl.Variables
import no.nav.etterlatte.person.pdl.PersonResponse
import no.nav.etterlatte.toJson
import org.slf4j.LoggerFactory

class PersonKlient(
    private val httpClient: HttpClient,
) {
    private val logger = LoggerFactory.getLogger(PersonKlient::class.java)

    companion object {
        private const val TEMA = "PEN"
        private const val BEHANDLINGSNUMMER = "behandlingsnummer"
    }

    suspend fun hentPerson(fnr: Foedselsnummer): PersonResponse {
        val query =
            javaClass
                .getResource("/pdl/hentPerson.graphql")!!
                .readText()
                .replace(Regex("[\n\t]"), "")

        val request = GraphqlRequest(query, Variables(ident = fnr.value)).toJson()

        val responseNode =
            unsafeRetry {
                httpClient
                    .post {
                        header("Tema", TEMA)
                        header(X_CORRELATION_ID, getCorrelationId())
                        header(BEHANDLINGSNUMMER, "EYO")
                        accept(ContentType.Application.Json)
                        setBody(TextContent(request, ContentType.Application.Json))
                    }.body<ObjectNode>()
            }

        return try {
            mapJsonToAny(responseNode!!.toJson())
        } catch (e: Exception) {
            logger.error("Error under deserialisering av pdl person", e)
            throw e
        }
    }
}