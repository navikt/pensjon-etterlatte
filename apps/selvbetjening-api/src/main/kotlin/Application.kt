package no.nav.etterlatte

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.databind.DeserializationFeature
import com.typesafe.config.Config
import com.typesafe.config.ConfigFactory
import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
import io.ktor.client.features.auth.Auth
import io.ktor.client.features.json.JacksonSerializer
import io.ktor.client.features.json.JsonFeature
import io.ktor.client.features.logging.DEFAULT
import io.ktor.client.features.logging.LogLevel
import io.ktor.client.features.logging.Logger
import io.ktor.client.features.logging.Logging
import io.ktor.config.HoconApplicationConfig
import io.ktor.util.KtorExperimentalAPI
import kotlinx.coroutines.delay
import no.nav.etterlatte.ktor.tokenexchange.bearerToken
import no.nav.etterlatte.oauth.ClientConfig
import no.nav.security.token.support.core.context.TokenValidationContext
import no.nav.security.token.support.core.jwt.JwtToken

class ApplicationContext(configLocation: String? = null) {
    private val closables = mutableListOf<() -> Unit>()
    val config: Config = configLocation?.let { ConfigFactory.load(it) } ?: ConfigFactory.load()
    private val defaultHttpClient = HttpClient(CIO) {
        install(JsonFeature) {
            serializer = JacksonSerializer {
                configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                setSerializationInclusion(JsonInclude.Include.NON_NULL)
            }
        }
        install(Logging) {
            logger = Logger.DEFAULT
            level = LogLevel.ALL
        }
    }

    fun close() {
        closables.forEach { it() }
    }

    val securityContext = ThreadLocal<SecurityContext>()
    val pdl: PdlService
    val tokenKlients = ClientConfig(HoconApplicationConfig(config), defaultHttpClient)

    init {
        val tokenexchangeIssuer = "tokenx"
        val tokenxKlient = checkNotNull(tokenKlients.clients[tokenexchangeIssuer])
        HttpClient(CIO) {
            install(JsonFeature) {
                serializer = JacksonSerializer {
                    configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                    setSerializationInclusion(JsonInclude.Include.NON_NULL)
                }
            }
            install(Auth) {
                bearerToken {
                    tokenprovider = suspend {
                        securityContext.get().tokenIssuedBy(tokenexchangeIssuer)?.let {
                            tokenxKlient.tokenExchange(
                                it.tokenAsString,
                                config.getString("no.nav.etterlatte.tjenester.pdl.audience")
                            ).accessToken
                        }
                    }
                }
            }
        }.also {
            pdl = PdlGraphqlKlient(config.getString("no.nav.etterlatte.tjenester.pdl.url"), "PEN", it)
            closables.add(it::close)
        }

        closables.add(defaultHttpClient::close)
    }

    fun httpClient() = defaultHttpClient
}

@KtorExperimentalAPI
suspend fun main() {
    delay(30_000)//Wait for istio-proxy
    ApplicationContext().also {
        Server(it).run()
    }.close()
}

class SecurityContext(private val tokens: TokenValidationContext) {
    fun tokenIssuedBy(issuer: String): JwtToken? {
        return tokens.getJwtToken(issuer)
    }

    fun user() = tokens.firstValidToken.get().jwtTokenClaims?.get("pid")?.toString()
}
