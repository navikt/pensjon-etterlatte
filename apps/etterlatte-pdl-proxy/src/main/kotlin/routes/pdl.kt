package no.nav.etterlatte.routes

import io.ktor.application.call
import io.ktor.auth.principal
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.statement.HttpResponse
import io.ktor.config.ApplicationConfig
import io.ktor.http.HttpHeaders
import io.ktor.request.header
import io.ktor.routing.Route
import io.ktor.routing.post
import io.ktor.routing.route
import no.nav.etterlatte.NavCallId
import no.nav.etterlatte.pdlhttpclient
import no.nav.etterlatte.pipeRequest
import no.nav.etterlatte.pipeResponse
import no.nav.etterlatte.tokenSecuredEndpoint
import no.nav.security.token.support.ktor.TokenValidationContextPrincipal
import org.slf4j.LoggerFactory
import java.util.*

val Tema: String get() = "Tema"
val XCorrelationID: String get() = "X-Correlation-ID"

fun Route.pdl(config: ApplicationConfig) {
    val logger = LoggerFactory.getLogger("no.pensjon.etterlatte")

    route("/pdl") {
        val clientCredentialHttpClient = pdlhttpclient()
        val tokenXHttpClient = tokenSecuredEndpoint(config.config("no.nav.etterlatte.tjenester.pdl"))
        val pdlUrl = config.property("no.nav.etterlatte.tjenester.pdl.url").toString()  //.getString("no.nav.etterlatte.tjenester.pdl.url")

        post {

            val callId = call.request.header(HttpHeaders.NavCallId) ?: UUID.randomUUID().toString()
            val tokenxToken = call.principal<TokenValidationContextPrincipal>()?.context?.getJwtToken("tokenx")
            val azureToken = call.principal<TokenValidationContextPrincipal>()?.context?.getJwtToken("azure")

            if (azureToken != null) {
                try {
                    val response = clientCredentialHttpClient.post<HttpResponse>(pdlUrl) {
                        header(XCorrelationID, callId)
                        pipeRequest(call, listOf(Tema))
                    }
                    call.pipeResponse(response)
                } catch (cause: Throwable) {
                    logger.error("Feil i kall mot PDL: $cause")
                    cause.printStackTrace()
                }
            } else if (tokenxToken != null) {
                try {
                    val response = tokenXHttpClient.post<HttpResponse>(pdlUrl) {
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
}
