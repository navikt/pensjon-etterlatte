package no.nav.etterlatte

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.node.ObjectNode
import com.nimbusds.jwt.SignedJWT
import com.typesafe.config.ConfigFactory
import io.ktor.application.call
import io.ktor.application.install
import io.ktor.auth.Authentication
import io.ktor.auth.authenticate
import io.ktor.auth.principal
import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
import io.ktor.client.features.json.JacksonSerializer
import io.ktor.client.features.json.JsonFeature
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.config.HoconApplicationConfig
import io.ktor.features.ContentNegotiation
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.content.TextContent
import io.ktor.jackson.jackson
import io.ktor.response.respond
import io.ktor.response.respondText
import io.ktor.routing.get
import io.ktor.routing.route
import io.ktor.routing.routing
import io.ktor.server.engine.applicationEngineEnvironment
import io.ktor.server.engine.connector
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import io.ktor.util.KtorExperimentalAPI
import no.nav.etterlatte.oauth.ClientConfig
import no.nav.security.token.support.client.core.oauth2.OAuth2AccessTokenResponse
import no.nav.security.token.support.ktor.TokenValidationContextPrincipal
import no.nav.security.token.support.ktor.tokenValidationSupport

val defaultHttpClient = HttpClient(CIO) {
    install(JsonFeature) {
        serializer = JacksonSerializer {
            configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
            setSerializationInclusion(JsonInclude.Include.NON_NULL)
        }
    }
}

@KtorExperimentalAPI
fun main() {
    embeddedServer(Netty, environment = applicationEngineEnvironment {
        module {
            config = HoconApplicationConfig(ConfigFactory.load())
            install(ContentNegotiation) {
                jackson()
            }

            install(Authentication) {
                tokenValidationSupport(config = config)
            }

            val oauth2Client = checkNotNull(ClientConfig(config, defaultHttpClient).clients["tokenx"])

            routing {
                route("internal") {
                    get("isalive") {
                        call.respondText("JADDA!", contentType = ContentType.Text.Plain)
                    }
                    get("isready") {
                        call.respondText("JADDA!", contentType = ContentType.Text.Plain)
                    }
                }
                route("api") {
                    get {
                        call.respond(HttpStatusCode.OK, Pair("navn", "Ola Nordmann"))
                    }
                }
                authenticate {
                    route("secure") {
                        get {
                            val token = call.principal<TokenValidationContextPrincipal>().asTokenString()
                            val oAuth2Response =
                                oauth2Client.tokenExchange(token, "dev-fss:etterlatte:etterlatte-proxy")

                            val person =
                                call.principal<TokenValidationContextPrincipal>()?.context?.firstValidToken?.get()?.jwtTokenClaims?.get(
                                    "pid"
                                )?.toString()
                            require(person != null)
                            val queryPart = """hentPerson(ident: "$person") {
            forelderBarnRelasjon {
                relatertPersonsIdent
                relatertPersonsRolle
            }
        }
        """

                            val gql = """{"query":"query{ ${
                                queryPart.replace(""""""", """\"""").replace("\n", """\n""")
                            } } "}"""
                            defaultHttpClient.post<ObjectNode>("https://etterlatte-proxy.dev-fss-pub.nais.io/pdl") {
                                header("Tema", "PEN")
                                header("Accept", "application/json")
                                header("Authorization", "Bearer ${oAuth2Response.accessToken}")
                                body = TextContent(gql, ContentType.Application.Json)
                            }.also {
                                val barnRelasjoner = it.get("data").get("hentPerson").get("forelderBarnRelasjon")
                                val barn = mutableListOf<String>()
                                for (i in 0 until barnRelasjoner.size())
                                    if (barnRelasjoner.get(i).get("relatertPersonsRolle").textValue() == "BARN")
                                        barn.add(barnRelasjoner.get(i).get("relatertPersonsIdent").textValue())

                                call.respond(
                                    HttpStatusCode.OK,
                                    mapOf(
                                        "navn" to "arne",
                                        "barn" to barn
                                    )
                                )
                            }
                        }
                    }
                }
            }
        }

        connector {
            port = 8080
        }
    }
    ).apply {
        Runtime.getRuntime().addShutdownHook(Thread {
            stop(3000, 3000)
        })
    }.start(true)

}

data class DemoTokenResponse(
    val grantType: String,
    val tokenResponse: OAuth2AccessTokenResponse
) {
    val claims: Map<String, Any> = SignedJWT.parse(tokenResponse.accessToken).jwtClaimsSet.claims
}

internal fun TokenValidationContextPrincipal?.asTokenString(): String =
    this?.context?.firstValidToken?.map { it.tokenAsString }?.orElse(null)
        ?: throw RuntimeException("no token found in call context")