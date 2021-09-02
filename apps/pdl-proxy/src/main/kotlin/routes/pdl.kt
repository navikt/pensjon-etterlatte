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
import no.nav.etterlatte.pdlhttpclient
import no.nav.etterlatte.pipeRequest
import no.nav.etterlatte.pipeResponse
import org.slf4j.LoggerFactory
import java.util.*

val Tema: String get() = "Tema"
val NavConsumerToken: String get() = "Nav-Consumer-Token"
val XCorrelationID: String get() = "X-Correlation-ID"

fun Route.pdl(config: Config) {
    val logger = LoggerFactory.getLogger("no.pensjon.etterlatte")
    route("/pdl") {
        val httpClient = pdlhttpclient()
        val pdlUrl = config.pdl.url
        post {

            val callId = call.request.header(HttpHeaders.NavCallId) ?: UUID.randomUUID().toString()
            val auth = call.request.header(HttpHeaders.Authorization)
            val navToken = call.request.header(NavConsumerToken)

            try {
                val response = httpClient.post<HttpResponse>(pdlUrl) {

                    //hvilken bearer skal jeg bruke her?
                    header(HttpHeaders.Authorization, auth)
                    header(NavConsumerToken, navToken)
                    header(XCorrelationID, callId)
                    pipeRequest(call, listOf(Tema))
                }
                call.pipeResponse(response)
            } catch (cause: Throwable) {
                logger.error("Feil i kall mot PDL: $cause")
                cause.printStackTrace()
            }
        }
    }
}
