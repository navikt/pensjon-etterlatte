package no.nav.etterlatte.person

import com.fasterxml.jackson.databind.node.ObjectNode
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.accept
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.content.TextContent
import io.ktor.http.ContentType.Application.Json
import no.nav.etterlatte.common.mapJsonToAny
import no.nav.etterlatte.common.toJson
import no.nav.etterlatte.libs.pdl.GraphqlRequest
import no.nav.etterlatte.libs.pdl.Variables
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.person.pdl.PersonResponse
import org.slf4j.LoggerFactory
import libs.common.util.unsafeRetry
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadType
import no.nav.etterlatte.libs.utils.logging.X_CORRELATION_ID
import no.nav.etterlatte.libs.utils.logging.getCorrelationId

interface Pdl {
    suspend fun hentPerson(fnr: Foedselsnummer, soeknadType: SoeknadType): PersonResponse
}

class PersonKlient(private val httpClient: HttpClient) : Pdl {
    private val logger = LoggerFactory.getLogger(PersonKlient::class.java)

    companion object {
        private const val TEMA = "PEN"
        private const val BEHANDLINGSNUMMER = "behandlingsnummer"
    }

    override suspend fun hentPerson(fnr: Foedselsnummer, soeknadType: SoeknadType): PersonResponse {
        val query = javaClass.getResource("/pdl/hentPerson.graphql")!!
            .readText()
            .replace(Regex("[\n\t]"), "")

        val request = GraphqlRequest(query, Variables(ident = fnr.value)).toJson()

        val responseNode = unsafeRetry {
            httpClient.post {
                header("Tema", TEMA)
                header(X_CORRELATION_ID, getCorrelationId())
                header(BEHANDLINGSNUMMER, soeknadType.behandlingsnummer.verdi)
                accept(Json)
                setBody(TextContent(request, Json))
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
