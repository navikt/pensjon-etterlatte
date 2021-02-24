package no.nav.etterlatte

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.JsonNode
import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.auth.jwt.*
import io.ktor.client.*
import io.ktor.client.engine.apache.*
import io.ktor.client.features.json.*
import io.ktor.client.statement.*
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.response.*
import io.ktor.util.*
import io.ktor.utils.io.*
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

            response.content.copyAndClose(channel)
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
