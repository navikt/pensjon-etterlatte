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
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.ktor.tokenexchange.bearerToken
import no.nav.etterlatte.oauth.ClientConfig
import no.nav.security.token.support.core.context.TokenValidationContext
import no.nav.security.token.support.core.jwt.JwtToken

interface Rapid {
    suspend fun publish(message: String): Job
}

object ThreadBoundSecCtx : ThreadLocal<SecurityContext>()

class ApplicationContext(configLocation: String? = null, wait: Job = GlobalScope.launch { }) {
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

    val pdl: PdlService
    val tokenKlients = ClientConfig(HoconApplicationConfig(config), defaultHttpClient)
    val rapid: Rapid =
        if (System.getenv().containsKey("KAFKA_BROKERS")) KafkaRapid.fromEnv(System.getenv()) else object : Rapid {
            override suspend fun publish(message: String): Job {
                return coroutineScope { launch { println(message) } }
            }
        }

    init {
        val tokenexchangeIssuer = "tokenx"
        val tokenxKlient = runBlocking {
            wait.join()
            checkNotNull(tokenKlients.clients[tokenexchangeIssuer])
        }
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
                        ThreadBoundSecCtx.get().tokenIssuedBy(tokenexchangeIssuer)?.let {
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
    ApplicationContext(wait = GlobalScope.launch { delay(30_000) }
    ).also {
        Server(it).run()
    }.close()
}

interface SecurityContext{
    fun tokenIssuedBy(issuer: String): JwtToken?
    fun user(): String?
}

class SynteticHardcodedUser(private val user:String): SecurityContext{
    override fun tokenIssuedBy(issuer: String): JwtToken? {
        return null
    }

    override fun user() = user

}

class TokenSecurityContext(private val tokens: TokenValidationContext): SecurityContext {
    override fun tokenIssuedBy(issuer: String): JwtToken? {
        return tokens.getJwtToken(issuer)
    }

    override fun user() = tokens.firstValidToken.get().jwtTokenClaims?.get("pid")?.toString()
}
