package no.nav.etterlatte.person.krr

import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.plugins.ClientRequestException
import io.ktor.client.request.accept
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.utils.EmptyContent.contentType
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.contentType
import io.ktor.http.isSuccess
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.libs.utils.logging.X_CORRELATION_ID
import no.nav.etterlatte.libs.utils.logging.getCorrelationId
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.util.UUID

interface Krr {
    suspend fun hentDigitalKontaktinformasjon(fnr: Foedselsnummer): DigitalKontaktinformasjon?
}

class KrrKlient(
    private val client: HttpClient,
) : Krr {
    private val logger: Logger = LoggerFactory.getLogger(KrrKlient::class.java)

    override suspend fun hentDigitalKontaktinformasjon(fnr: Foedselsnummer): DigitalKontaktinformasjon? {
        logger.info("Henter kontaktopplysninger fra KRR.")

        return try {
            val response =
                client.post("personer") {
                    header(HttpHeaders.NavCallId, UUID.randomUUID().toString())
                    header(X_CORRELATION_ID, getCorrelationId())
                    accept(ContentType.Application.Json)
                    contentType(ContentType.Application.Json)
                    setBody(DigitalKontaktinformasjonRequestBody(listOf(fnr.value)))
                }

            if (response.status.isSuccess()) {
                response.body<DigitalKontaktinformasjonResponseBody>().personer[fnr.value]
            } else {
                throw ClientRequestException(response, response.toString())
            }
        } catch (cause: Throwable) {
            logger.warn("Klarte ikke å hente kontaktinformasjon fra KRR.", KrrException(cause))
            return null
        }
    }
}

data class DigitalKontaktinformasjonRequestBody(
    val personidenter: List<String>,
)

data class DigitalKontaktinformasjonResponseBody(
    val personer: Map<String, DigitalKontaktinformasjon>,
)

class KrrException(
    cause: Throwable,
) : Exception("Klarte ikke å hente digital kontaktinfo fra Krr", cause)

val HttpHeaders.NavConsumerId: String
    get() = "Nav-Consumer-Id"
val HttpHeaders.NavCallId: String
    get() = "Nav-Call-Id"
val HttpHeaders.NavPersonIdent: String
    get() = "Nav-Personident"