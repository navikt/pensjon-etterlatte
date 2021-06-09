package no.nav.etterlatte

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.JsonNode
import io.ktor.application.ApplicationCall
import io.ktor.auth.authentication
import io.ktor.auth.jwt.JWTPrincipal
import io.ktor.client.HttpClient
import io.ktor.client.call.receive
import io.ktor.client.engine.apache.Apache
import io.ktor.client.features.json.JacksonSerializer
import io.ktor.client.features.json.JsonFeature
import io.ktor.client.statement.HttpResponse
import io.ktor.http.ContentType
import io.ktor.http.Headers
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.http.content.OutgoingContent
import io.ktor.response.respond
import io.ktor.util.KtorExperimentalAPI
import io.ktor.util.filter
import io.ktor.utils.io.ByteReadChannel
import io.ktor.utils.io.ByteWriteChannel
import io.ktor.utils.io.copyAndClose
import org.apache.http.impl.conn.SystemDefaultRoutePlanner
import java.net.ProxySelector

@KtorExperimentalAPI
fun httpClient() = HttpClient(Apache) {
    install(JsonFeature) {
        serializer = JacksonSerializer { configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false) }
    }
}

fun httpClientWithProxy() = HttpClient(Apache) {
    install(JsonFeature) {
        serializer = JacksonSerializer { configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false) }
    }
    engine {
        customizeClient {
            setRoutePlanner(SystemDefaultRoutePlanner(ProxySelector.getDefault()))
        }
    }
}

suspend fun ApplicationCall.pipeResponse(response: HttpResponse) {
    val proxiedHeaders = response.headers
    val contentType = proxiedHeaders[HttpHeaders.ContentType]
    val contentLength = proxiedHeaders[HttpHeaders.ContentLength]

    respond(object : OutgoingContent.WriteChannelContent() {
        override val contentLength: Long? = contentLength?.toLong()
        override val contentType: ContentType? = contentType?.let { ContentType.parse(it) }
        override val headers: Headers = Headers.build {
            appendAll(proxiedHeaders.filter { key, _ ->
                !key.equals(
                    HttpHeaders.ContentType,
                    ignoreCase = true
                ) && !key.equals(HttpHeaders.ContentLength, ignoreCase = true)
                    && !key.equals(HttpHeaders.TransferEncoding, ignoreCase = true)
            })
        }
        override val status: HttpStatusCode = response.status
        override suspend fun writeTo(channel: ByteWriteChannel) {

            if(response.content.isClosedForRead) {
                response.receive<ByteReadChannel>().copyAndClose(channel)
            } else {
                response.content.copyAndClose(channel)
            }
        }
    })
}

fun ApplicationCall.getTokenInfo(): Map<String, JsonNode> = authentication
    .principal<JWTPrincipal>()
    ?.let { principal ->
        principal.payload.claims.entries
            .associate { claim -> claim.key to claim.value.`as`(JsonNode::class.java) }
    } ?: error("No JWT principal found in request")

val HttpHeaders.NavCallId: String
    get() = "Nav-Call-Id"
val HttpHeaders.NavConsumerId: String
    get() = "Nav-Consumer-Id"
val HttpHeaders.NavPersonIdenter: String
    get() = "Nav-Personidenter"
