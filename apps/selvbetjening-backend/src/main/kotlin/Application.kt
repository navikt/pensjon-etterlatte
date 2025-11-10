package no.nav.etterlatte

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.typesafe.config.Config
import com.typesafe.config.ConfigFactory
import io.ktor.client.HttpClient
import io.ktor.client.engine.okhttp.OkHttp
import io.ktor.client.plugins.auth.Auth
import io.ktor.client.plugins.defaultRequest
import io.ktor.http.encodedPath
import io.ktor.http.takeFrom
import io.ktor.serialization.jackson.jackson
import io.ktor.server.application.Application
import io.ktor.server.application.ApplicationCall
import io.ktor.server.application.call
import io.ktor.server.application.install
import io.ktor.server.auth.Authentication
import io.ktor.server.auth.authenticate
import io.ktor.server.auth.principal
import io.ktor.server.config.HoconApplicationConfig
import io.ktor.server.plugins.callloging.CallLogging
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.request.header
import io.ktor.server.request.path
import io.ktor.server.routing.IgnoreTrailingSlash
import io.ktor.server.routing.Route
import io.ktor.server.routing.routing
import io.ktor.util.pipeline.PipelineContext
import no.nav.etterlatte.funksjonsbrytere.FeatureToggleProperties
import no.nav.etterlatte.funksjonsbrytere.FeatureToggleService
import no.nav.etterlatte.internal.healthApi
import no.nav.etterlatte.internal.metricsApi
import no.nav.etterlatte.kafka.GcpKafkaConfig
import no.nav.etterlatte.kafka.KafkaProdusent
import no.nav.etterlatte.kafka.TestProdusent
import no.nav.etterlatte.kafka.standardProducer
import no.nav.etterlatte.ktorclientauth.ClientCredentialAuthProvider
import no.nav.etterlatte.ktortokenexchange.BearerTokenAuthProvider
import no.nav.etterlatte.ktortokenexchange.TokenSupportSecurityContextMediator
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.libs.utils.logging.CORRELATION_ID
import no.nav.etterlatte.libs.utils.logging.X_CORRELATION_ID
import no.nav.etterlatte.omsendringer.OmsMeldInnEndringRepository
import no.nav.etterlatte.omsendringer.OmsMeldInnEndringService
import no.nav.etterlatte.omsendringer.OmsMeldtInnEndringMottakFullfoert
import no.nav.etterlatte.omsendringer.PubliserOmsMeldtInnEndringJobb
import no.nav.etterlatte.omsendringer.omsMeldInnEndring
import no.nav.etterlatte.person.PersonKlient
import no.nav.etterlatte.person.PersonService
import no.nav.etterlatte.person.person
import no.nav.etterlatte.sak.SakKlient
import no.nav.etterlatte.sak.SakService
import no.nav.etterlatte.sak.sak
import no.nav.helse.rapids_rivers.RapidApplication
import no.nav.security.token.support.v2.TokenValidationContextPrincipal
import no.nav.security.token.support.v2.tokenValidationSupport
import org.slf4j.event.Level
import java.util.Timer
import java.util.UUID
import java.util.concurrent.atomic.AtomicBoolean

private fun featureToggleProperties(config: Config) =
    FeatureToggleProperties(
        applicationName = config.getString("funksjonsbrytere.unleash.applicationName"),
        host = config.getString("funksjonsbrytere.unleash.host"),
        apiKey = config.getString("funksjonsbrytere.unleash.token"),
    )

fun clusternavn(): String? = System.getenv()["NAIS_CLUSTER_NAME"]

enum class GcpEnv(
    val env: String,
) {
    PROD("prod-gcp"),
    DEV("dev-gcp"),
}

fun appIsInGCP(): Boolean =
    when (val naisClusterName = clusternavn()) {
        null -> false
        else -> GcpEnv.entries.map { it.env }.contains(naisClusterName)
    }

val closables = mutableListOf<() -> Unit>()
val config: Config = ConfigFactory.load()

val hoconApplicationConfig = HoconApplicationConfig(config)
val securityMediator = TokenSupportSecurityContextMediator(hoconApplicationConfig)

fun main() {
    val datasourceBuilder = DataSourceBuilder(System.getenv())

    val env =
        System.getenv().toMutableMap().apply {
            put("KAFKA_CONSUMER_GROUP_ID", get("NAIS_APP_NAME")!!.replace("-", ""))
        }

    val rapid: KafkaProdusent<String, String> =
        if (appIsInGCP()) {
            GcpKafkaConfig.fromEnv(env).standardProducer(env.getValue("KAFKA_RAPID_TOPIC"))
        } else {
            TestProdusent()
        }

    val omsMeldInnEndringService =
        OmsMeldInnEndringService(
            OmsMeldInnEndringRepository(datasourceBuilder.dataSource),
        )

    val peronService =
        tokenSecuredEndpoint(config.getConfig("no.nav.etterlatte.tjenester.pdl"))
            .also {
                closables.add(it::close)
            }.let { PersonService(PersonKlient(it)) }
    val sakService =
        SakService(
            SakKlient(
                httpClient =
                    httpClientClientCredentials(
                        azureAppScope = config.getString("etterlatte-api.scope"),
                    ),
                apiUrl = config.getString("etterlatte-api.url"),
            ),
        )

    val featureToggleService: FeatureToggleService =
        FeatureToggleService.initialiser(
            properties = featureToggleProperties(config),
        )

    val rapidApplication =
        RapidApplication
            .Builder(RapidApplication.RapidApplicationConfig.fromEnv(env))
            .withKtorModule {
                apiModule {
                    metricsApi()
                    person(peronService)
                    sak(sakService)
                    omsMeldInnEndring(omsMeldInnEndringService)
                }
            }.build {
                datasourceBuilder.migrate()
            }.also { rapidConnection ->
                PubliserOmsMeldtInnEndringJobb(rapid, omsMeldInnEndringService, featureToggleService)
                    .schedule()
                    ?.addShutdownHook()
                OmsMeldtInnEndringMottakFullfoert(rapidConnection, omsMeldInnEndringService)
            }
    rapidApplication.start()
}

fun PipelineContext<Unit, ApplicationCall>.fnrFromToken() =
    call
        .principal<TokenValidationContextPrincipal>()
        ?.context
        ?.firstValidToken
        ?.jwtTokenClaims
        ?.get("pid")!!
        .toString()
        .let { Foedselsnummer.of(it) }

fun Application.apiModule(routes: Route.() -> Unit) {
    install(Authentication) {
        tokenValidationSupport(config = HoconApplicationConfig(ConfigFactory.load()))
    }
    install(ContentNegotiation) {
        jackson {
            enable(DeserializationFeature.READ_UNKNOWN_ENUM_VALUES_AS_NULL)
            disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
            disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
            registerModule(JavaTimeModule())
        }
    }
    install(IgnoreTrailingSlash)
    install(CallLogging) {
        level = Level.INFO
        disableDefaultColors()
        filter { call -> !call.request.path().matches(Regex(".*/isready|.*/isalive|.*/metrics")) }
        mdc(CORRELATION_ID) { call -> call.request.header(X_CORRELATION_ID) ?: UUID.randomUUID().toString() }
    }

    routing {
        healthApi()
        authenticate {
            securityMediator.autentiser(this)
            routes()
        }
    }
}

val shuttingDown: AtomicBoolean = AtomicBoolean(false)

private fun Timer.addShutdownHook() =
    Runtime.getRuntime().addShutdownHook(
        Thread {
            shuttingDown.set(true)
            this.cancel()
        },
    )

private fun tokenSecuredEndpoint(endpointConfig: Config) =
    HttpClient(OkHttp) {
        install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) {
            jackson {
                configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                setSerializationInclusion(JsonInclude.Include.NON_NULL)
                registerModule(JavaTimeModule())
            }
        }

        install(Auth) {
            providers.add(
                BearerTokenAuthProvider(securityMediator.outgoingToken(endpointConfig.getString("audience"))),
            )
        }

        defaultRequest {
            url.takeFrom(endpointConfig.getString("url") + url.encodedPath)
        }
    }

fun httpClientClientCredentials(azureAppScope: String) =
    HttpClient(OkHttp) {
        install(io.ktor.client.plugins.contentnegotiation.ContentNegotiation) {
            jackson {
                configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                setSerializationInclusion(JsonInclude.Include.NON_NULL)
                registerModule(JavaTimeModule())
            }
        }
        val env = System.getenv()

        install(Auth) {
            providers.add(
                ClientCredentialAuthProvider(
                    mapOf(
                        AzureDefaultEnvVariables.AZURE_APP_CLIENT_ID.name to
                            env[AzureDefaultEnvVariables.AZURE_APP_CLIENT_ID.name]!!,
                        AzureDefaultEnvVariables.AZURE_APP_JWK.name to
                            env[AzureDefaultEnvVariables.AZURE_APP_JWK.name]!!,
                        AzureDefaultEnvVariables.AZURE_APP_WELL_KNOWN_URL.name to
                            env[AzureDefaultEnvVariables.AZURE_APP_WELL_KNOWN_URL.name]!!,
                        AzureDefaultEnvVariables.AZURE_APP_OUTBOUND_SCOPE.name to azureAppScope,
                    ),
                ),
            )
        }
    }

enum class AzureDefaultEnvVariables {
    AZURE_APP_CLIENT_ID,
    AZURE_APP_JWK,
    AZURE_APP_WELL_KNOWN_URL,
    AZURE_APP_OUTBOUND_SCOPE,
}