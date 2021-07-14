package no.nav.etterlatte.routes

import io.ktor.application.call
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.statement.HttpResponse
import io.ktor.http.HttpHeaders
import io.ktor.request.header
import io.ktor.routing.Route
import io.ktor.routing.post
import io.ktor.routing.route
import no.nav.etterlatte.Config
import no.nav.etterlatte.NavCallId
import no.nav.etterlatte.StsClient
import no.nav.etterlatte.httpClient
import no.nav.etterlatte.pipeRequest
import no.nav.etterlatte.pipeResponse
import org.slf4j.LoggerFactory
import java.util.*

val HttpHeaders.Tema: String get() = "Tema"
val HttpHeaders.NavConsumerToken: String get() = "Nav-Consumer-Token"
val HttpHeaders.XCorrelationID: String get() = "X-Correlation-ID"

fun Route.pdl(config: Config, stsClient: StsClient) {
    val logger = LoggerFactory.getLogger("no.pensjon.etterlatte")
    route("/pdl") {
        val httpClient = httpClient()
        val pdlUrl = config.pdl.url

        post {
            val stsToken = stsClient.getToken()
            val callId = call.request.header(HttpHeaders.NavCallId) ?: UUID.randomUUID().toString()

            try {
                val response = httpClient.post<HttpResponse>(pdlUrl) {
                    header(HttpHeaders.Authorization, "Bearer $stsToken")
                    header(HttpHeaders.NavConsumerToken, "Bearer $stsToken")
                    header(HttpHeaders.XCorrelationID, callId)
                    pipeRequest(call, listOf(HttpHeaders.Tema))
                }
                call.pipeResponse(response)
            } catch (cause: Throwable) {
                logger.error("Feil i kall mot PDL: $cause")
                cause.printStackTrace()
            }
        }
    }
}
