package no.nav.etterlatte.routes

import com.typesafe.config.Config
import io.ktor.application.call
import io.ktor.auth.principal
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.statement.HttpResponse
import io.ktor.config.HoconApplicationConfig
import io.ktor.http.HttpHeaders
import io.ktor.request.header
import io.ktor.routing.Route
import io.ktor.routing.post
import io.ktor.routing.route
import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.ApplicationContext
import no.nav.etterlatte.NavCallId
import no.nav.etterlatte.defaultHttpClient
import no.nav.etterlatte.oauth.ClientConfig
import no.nav.etterlatte.pipeRequest
import no.nav.etterlatte.pipeResponse
import no.nav.security.token.support.ktor.TokenValidationContextPrincipal
import org.slf4j.LoggerFactory
import java.util.*

val Tema: String get() = "Tema"
val XCorrelationID: String get() = "X-Correlation-ID"

fun Route.pdl(config: Config, context: ApplicationContext) {
    val logger = LoggerFactory.getLogger("no.pensjon.etterlatte")

    route("/pdl") {
        println(this.toString())
        val tokenexchangeIssuer = "tokenx"
        val pdlUrl = config.getString( "no.nav.etterlatte.tjenester.pdl.url")
        //val tokenXHttpClient = tokenSecuredEndpoint()
         //   .also { context.closables.add(it::close) }
       // val clientCredentialHttpClient = pdlhttpclient(config.getConfig("no.nav.etterlatte.tjenester.pdl.aad"))
        //    .also { context.closables.add(it::close) }
        val tokenxKlient = runBlocking {
            //endre denne???
            config.getString("no.nav.etterlatte.tjenester.pdl.ventmedutgaaendekall")?.toLong()?.also {
                logger.debug("Venter $it sekunder før kall til token-issuers")
                delay(it * 1000)
            }
            checkNotNull(ClientConfig(HoconApplicationConfig(config), defaultHttpClient()).clients[tokenexchangeIssuer])
        }

        post {
            val callId = call.request.header(NavCallId) ?: UUID.randomUUID().toString()
            val tokenxToken = call.principal<TokenValidationContextPrincipal>()?.context?.getJwtToken("tokenx")
            val azureToken = call.principal<TokenValidationContextPrincipal>()?.context?.getJwtToken("azure")

            if (azureToken != null) {
                try {
                    val response = context.clientCredentialHttpClient.post<HttpResponse>(pdlUrl) {
                        header(XCorrelationID, callId)
                        pipeRequest(call, listOf(Tema))
                    }
                    call.pipeResponse(response)
                } catch (cause: Throwable) {
                    logger.error("Feil i kall mot PDL med AAD: ", cause)
                }
            } else if (tokenxToken != null) {
                //endre path
                val returToken =
                    config.getString("no.nav.etterlatte.tjenester.pdl.audience")?.let { audience ->
                        tokenxKlient.tokenExchange(
                            tokenxToken.tokenAsString,
                            audience
                        ).accessToken
                    }

                try {
                    val response = context.tokenXHttpClient.post<HttpResponse>(pdlUrl) {
                        header(XCorrelationID, callId)
                        header(HttpHeaders.Authorization, "Bearer $returToken")
                        pipeRequest(call, listOf(Tema))
                    }
                    call.pipeResponse(response)
                } catch (cause: Throwable) {
                    logger.error("Feil i kall mot PDL med TokenX: ", cause)
                }
            }
        }
    }
}
