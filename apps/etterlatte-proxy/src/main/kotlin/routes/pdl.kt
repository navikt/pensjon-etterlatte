package no.nav.etterlatte.routes

import io.ktor.application.call
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.statement.HttpResponse
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.request.header
import io.ktor.request.receiveChannel
import io.ktor.routing.Route
import io.ktor.routing.post
import io.ktor.routing.route
import io.ktor.util.KtorExperimentalAPI
import no.nav.etterlatte.Config
import no.nav.etterlatte.NavCallId
import no.nav.etterlatte.ProxiedContent
import no.nav.etterlatte.StsClient
import no.nav.etterlatte.httpClient
import no.nav.etterlatte.pipeResponse
import java.util.*

@KtorExperimentalAPI
fun Route.pdl(
    config: Config,
    stsClient: StsClient,
) {
    route("/pdl") {
        post {

            val pdlUrl = config.pdl.url
            val stsToken = stsClient.getToken()
            val callId = call.request.header(HttpHeaders.NavCallId) ?: UUID.randomUUID().toString()

            try {
                val response = httpClient().post<HttpResponse>(pdlUrl) {
                    header(HttpHeaders.Authorization, "Bearer $stsToken")
                    header("Nav-Consumer-Token", "Bearer $stsToken")
                    header("X-Correlation-ID", callId)
                    method = HttpMethod.Post
                    body = ProxiedContent(call.request.headers, call.receiveChannel())
                }
                call.pipeResponse(response)
            } catch (cause: Throwable) {
                println("Feil i kall mot PDL: $cause")
                cause.printStackTrace()
            }
        }
    }
}
