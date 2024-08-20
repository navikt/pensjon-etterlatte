package no.nav.etterlatte

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.typesafe.config.Config
import com.typesafe.config.ConfigFactory
import io.ktor.client.HttpClient
import io.ktor.client.engine.okhttp.OkHttp
import io.ktor.client.plugins.auth.Auth
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.plugins.defaultRequest
import io.ktor.http.encodedPath
import io.ktor.http.takeFrom
import io.ktor.serialization.jackson.jackson
import io.ktor.server.config.HoconApplicationConfig
import no.nav.etterlatte.adressebeskyttelse.AdressebeskyttelseService
import no.nav.etterlatte.kodeverk.KodeverkKlient
import no.nav.etterlatte.kodeverk.KodeverkService
import no.nav.etterlatte.ktortokenexchange.BearerTokenAuthProvider
import no.nav.etterlatte.ktortokenexchange.TokenSupportSecurityContextMediator
import no.nav.etterlatte.pdl.AdressebeskyttelseKlient
import no.nav.etterlatte.person.PersonKlient
import no.nav.etterlatte.person.PersonService
import no.nav.etterlatte.person.krr.KrrKlient
import no.nav.etterlatte.ktorclientauth.clientCredential
import no.nav.etterlatte.soknad.SoeknadService

class ApplicationContext(
    configLocation: String? = null
) {
    private val closables = mutableListOf<() -> Unit>()
    private val config: Config = configLocation?.let { ConfigFactory.load(it) } ?: ConfigFactory.load()

    fun close() {
        closables.forEach { it() }
    }

    val personService: PersonService
    val soeknadService: SoeknadService
    val kodeverkService: KodeverkService
    val hoconApplicationConfig = HoconApplicationConfig(config)
    val securityMediator = TokenSupportSecurityContextMediator(hoconApplicationConfig)
    val unsecuredSoeknadHttpClient: HttpClient
    private val krrKlient: KrrKlient
    private val adressebeskyttelseService: AdressebeskyttelseService

    init {
        kodeverkService =
            kodeverkHttpClient(config)
                .also { closables.add(it::close) }
                .let { KodeverkService(KodeverkKlient(it, config.getString("kodeverk.resource.url"))) }

        krrKlient =
            tokenSecuredEndpoint(config.getConfig("no.nav.etterlatte.tjenester.krr"))
                .also { closables.add(it::close) }
                .let { KrrKlient(it) }

        personService =
            tokenSecuredEndpoint(config.getConfig("no.nav.etterlatte.tjenester.pdl"))
                .also { closables.add(it::close) }
                .let { PersonService(PersonKlient(it), kodeverkService, krrKlient) }

        adressebeskyttelseService =
            systemPdlHttpClient()
                .also { closables.add(it::close) }
                .let { AdressebeskyttelseService(AdressebeskyttelseKlient(it, config.getString("no.nav.etterlatte.tjenester.pdl.url"))) }

        soeknadService =
            tokenSecuredEndpoint(config.getConfig("no.nav.etterlatte.tjenester.innsendtsoeknad"))
                .also { closables.add(it::close) }
                .let { SoeknadService(it, adressebeskyttelseService) }

        unsecuredSoeknadHttpClient =
            unsecuredEndpoint(
                config.getConfig("no.nav.etterlatte.tjenester.innsendtsoeknad").getString("url").replace("/api/", "")
            )
    }

    private fun unsecuredEndpoint(url: String) =
        HttpClient(OkHttp) {
            install(ContentNegotiation) {
                jackson {
                    configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                    setSerializationInclusion(JsonInclude.Include.NON_NULL)
                    registerModule(JavaTimeModule())
                }
            }

            defaultRequest {
                url(url)
            }
        }

    private fun tokenSecuredEndpoint(endpointConfig: Config) =
        HttpClient(OkHttp) {
            install(ContentNegotiation) {
                jackson {
                    configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                    setSerializationInclusion(JsonInclude.Include.NON_NULL)
                    registerModule(JavaTimeModule())
                }
            }

            install(Auth) {
                providers.add(BearerTokenAuthProvider(securityMediator.outgoingToken(endpointConfig.getString("audience"))))
            }

            defaultRequest {
                url.takeFrom(endpointConfig.getString("url") + url.encodedPath)
            }
        }

    private fun kodeverkHttpClient(appConfig: Config) =
        httpClientClientCredentials(
            azureAppScope = "api://${appConfig.getString("kodeverk.client.id")}/.default"
        )


    // OBS: Denne klienten kaller PDL med en systembruker.
    // Informasjon fra denne klienten kan inneholde informasjon sluttbruker ikke har rett til å se.
    private fun systemPdlHttpClient() =
        httpClientClientCredentials(azureAppScope = System.getenv()["PDL_AZURE_SCOPE"]!!)
}

fun httpClientClientCredentials(
    azureAppScope: String,
) = HttpClient(OkHttp) {
    install(ContentNegotiation) {
        jackson {
            configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
            setSerializationInclusion(JsonInclude.Include.NON_NULL)
            registerModule(JavaTimeModule())
        }
    }
    val env = System.getenv()

    install(Auth) {
        clientCredential {
            config =
                mapOf(
                    AzureEnums.AZURE_APP_CLIENT_ID.name to env[AzureEnums.AZURE_APP_CLIENT_ID.name]!!,
                    AzureEnums.AZURE_APP_JWK.name to env[AzureEnums.AZURE_APP_JWK.name]!!,
                    AzureEnums.AZURE_APP_WELL_KNOWN_URL.name to env[AzureEnums.AZURE_APP_WELL_KNOWN_URL.name]!!,
                    AzureEnums.AZURE_APP_OUTBOUND_SCOPE.name to azureAppScope,
                )
        }
    }
}

enum class AzureEnums {
    AZURE_APP_CLIENT_ID,
    AZURE_APP_JWK,
    AZURE_APP_WELL_KNOWN_URL,
    AZURE_APP_OUTBOUND_SCOPE,
    ;

    fun key() = name
}

fun main() {
    ApplicationContext()
        .also { Server(it).run() }
        .close()
}