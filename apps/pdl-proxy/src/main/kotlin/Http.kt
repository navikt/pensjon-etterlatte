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
import io.ktor.client.features.logging.LogLevel
import io.ktor.client.features.logging.Logging
import io.ktor.client.request.HttpRequestBuilder
import io.ktor.client.statement.HttpResponse
import io.ktor.http.ContentType
import io.ktor.http.Headers
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.http.content.OutgoingContent
import io.ktor.request.receiveChannel
import io.ktor.response.respond
import io.ktor.util.filter
import io.ktor.utils.io.ByteReadChannel
import io.ktor.utils.io.ByteWriteChannel
import io.ktor.utils.io.copyAndClose
import org.apache.http.impl.conn.SystemDefaultRoutePlanner
import java.net.ProxySelector

fun jsonClient() =  HttpClient(Apache) {
    install(JsonFeature) {
        serializer = JacksonSerializer { configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false) }
    }
}

fun httpClient() = HttpClient(Apache){
    install(Logging) {
        level = LogLevel.HEADERS
    }
}.also { Runtime.getRuntime().addShutdownHook(Thread{it.close()}) }

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

val proxiedContenHeaders = listOf(
    HttpHeaders.ContentType,
    HttpHeaders.ContentLength,
    HttpHeaders.TransferEncoding,
)
fun filterContenHeaders(requestHeaders: Headers): Headers{
    return Headers.build { appendAll(requestHeaders.filter { key, _ -> proxiedContenHeaders.any{it.equals(key, true)} }) }
}

class ProxiedContent(val proxiedHeaders: Headers, val content: ByteReadChannel, override val status: HttpStatusCode? = null): OutgoingContent.WriteChannelContent(){
    companion object{
        private val ignoredHeaders = listOf(HttpHeaders.ContentType, HttpHeaders.ContentLength, HttpHeaders.TransferEncoding, HttpHeaders.Authorization)
    }
    override val contentLength: Long? = proxiedHeaders[HttpHeaders.ContentLength]?.toLong()
    override val contentType: ContentType? = proxiedHeaders[HttpHeaders.ContentType]?.let { ContentType.parse(it) }
    override val headers: Headers = Headers.build {
        appendAll(proxiedHeaders.filter { key, _ ->
            ignoredHeaders.none { it.equals(key, ignoreCase = true) }
        })
    }
    override suspend fun writeTo(channel: ByteWriteChannel) {
        content.copyAndClose(channel)
    }
}

suspend fun HttpRequestBuilder.pipeRequest(call: ApplicationCall, customHeaders: List<String> = emptyList()){
    val requestHeadersToProxy = listOf(
        HttpHeaders.Accept,
        HttpHeaders.AcceptCharset,
        HttpHeaders.AcceptEncoding,
    ) + customHeaders
    headers.appendAll(call.request.headers.filter { key, _ ->
        requestHeadersToProxy.any{it.equals(key, true)}
    })
    body = ProxiedContent(filterContenHeaders(call.request.headers), call.receiveChannel())
}

suspend fun ApplicationCall.pipeResponse(response: HttpResponse) {
    respond(ProxiedContent(response.headers, if(response.content.isClosedForRead) { response.receive() } else { response.content }, response.status))
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
