package no.nav.etterlatte.ktortokenexchange

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.databind.DeserializationFeature
import io.ktor.client.HttpClient
import io.ktor.client.engine.okhttp.OkHttp
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.serialization.jackson.jackson
import io.ktor.server.application.ApplicationCallPipeline
import io.ktor.server.application.call
import io.ktor.server.auth.principal
import io.ktor.server.config.ApplicationConfig
import io.ktor.server.routing.Route
import io.ktor.server.routing.intercept
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.asContextElement
import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import no.nav.etterlatte.ktortokenexchange.oauth.ClientConfig
import no.nav.security.token.support.core.context.TokenValidationContext
import no.nav.security.token.support.core.jwt.JwtToken
import no.nav.security.token.support.v2.TokenValidationContextPrincipal

class TokenSecurityContext(
    private val tokens: TokenValidationContext,
) {
    fun tokenIssuedBy(issuer: String): JwtToken? = tokens.getJwtToken(issuer)

    fun user() =
        tokens.firstValidToken
            ?.jwtTokenClaims
            ?.get("pid")
            ?.toString()
}

class TokenSupportSecurityContextMediator(
    private val configuration: ApplicationConfig,
) {
    private val defaultHttpClient =
        HttpClient(OkHttp) {
            install(ContentNegotiation) {
                jackson {
                    configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                    setSerializationInclusion(JsonInclude.Include.NON_NULL)
                }
            }
        }

    private val tokenexchangeIssuer = "tokenx"
    private val tokenxKlient =
        runBlocking {
            configuration.propertyOrNull("no.nav.etterlatte.app.ventmedutgaaendekall")?.getString()?.toLong()?.also {
                println("Venter $it sekunder før kall til token-issuers")
                delay(it * 1000)
            }
            checkNotNull(ClientConfig(configuration, defaultHttpClient).clients[tokenexchangeIssuer])
        }

    fun autentiser(route: Route) {
        route.intercept(ApplicationCallPipeline.Call) {
            withContext(
                Dispatchers.Default +
                    ThreadBoundSecurityContext.asContextElement(
                        value =
                            TokenSecurityContext(
                                call.principal<TokenValidationContextPrincipal>()?.context!!,
                            ),
                    ),
            ) {
                proceed()
            }
        }
    }

    fun outgoingToken(audience: String) =
        suspend {
            requireNotNull(
                ThreadBoundSecurityContext.get().tokenIssuedBy(tokenexchangeIssuer)?.let {
                    requireNotNull(
                        tokenxKlient
                            .tokenExchange(
                                it.encodedToken,
                                audience,
                            ).access_token,
                    ) { "AccessToken må være definert, var null. Audience: $audience" }
                },
            ) { "Innbytta token må være definert, var null. Audience: $audience" }
        }
}

object ThreadBoundSecurityContext : ThreadLocal<TokenSecurityContext>()