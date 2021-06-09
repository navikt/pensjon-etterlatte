package no.nav.etterlatte.routes

import io.ktor.application.call
import io.ktor.client.features.ResponseException
import io.ktor.client.request.accept
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.statement.HttpResponse
import io.ktor.http.ContentType
import io.ktor.http.Headers
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.request.accept
import io.ktor.request.receiveChannel
import io.ktor.response.respondText
import io.ktor.routing.Route
import io.ktor.routing.post
import io.ktor.routing.route
import io.ktor.util.KtorExperimentalAPI
import io.ktor.util.filter
import no.nav.etterlatte.Config
import no.nav.etterlatte.ProxiedContent
import no.nav.etterlatte.StsClient
import no.nav.etterlatte.httpClient
import no.nav.etterlatte.pipeResponse

val contentHeaders = listOf(HttpHeaders.ContentType, HttpHeaders.ContentLength, HttpHeaders.TransferEncoding)

@KtorExperimentalAPI
fun Route.dok(
    config: Config,
    stsClient: StsClient,
) {
    route("/dok") {
        post {

            val dokUrl = config.dok.url
            val stsToken = stsClient.getToken()
            //val callId = call.request.header(HttpHeaders.NavCallId) ?: UUID.randomUUID().toString()

            try {
                val response = httpClient().post<HttpResponse>(dokUrl) {
                    header(HttpHeaders.Authorization, "Bearer $stsToken")
                    call.request.accept()?.split(",")?.forEach {
                        accept(ContentType.parse(it))
                    }
                    method = HttpMethod.Post
                    body = ProxiedContent(Headers.build { appendAll(call.request.headers.filter { key, _ -> contentHeaders.any{it.equals(key, true)} }) }, call.receiveChannel())
                }
                call.pipeResponse(response)
            } catch (cause: ResponseException) {
                println("Feil i kall mot Dokarkiv: $cause")
                cause.printStackTrace()
                //call.respondText(status = cause.response.status) { cause.message!! }
                call.pipeResponse(cause.response)
            } catch (cause: Throwable) {
                println("Feil i kall mot Dokarkiv: $cause")
                cause.printStackTrace()
                call.respondText(status = HttpStatusCode.InternalServerError) { cause.message ?: "Intern feil" }
            }
        }
    }
}
