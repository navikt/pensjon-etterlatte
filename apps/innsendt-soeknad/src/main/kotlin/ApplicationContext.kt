package no.nav.etterlatte

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.databind.DeserializationFeature
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
import no.nav.etterlatte.kafka.GcpKafkaConfig
import no.nav.etterlatte.kafka.TestProdusent
import no.nav.etterlatte.kafka.standardProducer
import no.nav.etterlatte.kodeverk.KodeverkKlient
import no.nav.etterlatte.kodeverk.KodeverkService
import no.nav.etterlatte.ktortokenexchange.BearerTokenAuthProvider
import no.nav.etterlatte.ktortokenexchange.TokenSupportSecurityContextMediator
import no.nav.etterlatte.pdl.AdressebeskyttelseKlient
import no.nav.etterlatte.person.PersonKlient
import no.nav.etterlatte.person.PersonService
import no.nav.etterlatte.person.krr.KrrKlient
import no.nav.etterlatte.soeknad.SoeknadService
import no.nav.etterlatte.ktorclientauth.clientCredential
import soeknad.PostgresSoeknadRepository

class ApplicationContext(env: Map<String, String>) {

	private val closables = mutableListOf<() -> Unit>()
	private val config: Config = ConfigFactory.load()

	val hoconApplicationConfig = HoconApplicationConfig(config)
	val securityMediator = TokenSupportSecurityContextMediator(hoconApplicationConfig)

	val datasourceBuilder: DataSourceBuilder = DataSourceBuilder(System.getenv())
	val db: PostgresSoeknadRepository = PostgresSoeknadRepository.using(datasourceBuilder.dataSource)

	val utkastPubliserer: UtkastPubliserer

	val soeknadService: SoeknadService

	val kodeverkService: KodeverkService

	val personService: PersonService

	private val krrKlient: KrrKlient
	private val adressebeskyttelseService: AdressebeskyttelseService

	init {

		val minsideProducer = if (appIsInGCP()) {
			GcpKafkaConfig.fromEnv(env).standardProducer(env.getValue("KAFKA_UTKAST_TOPIC"))
		} else {
			TestProdusent()
		}
		utkastPubliserer = UtkastPubliserer(minsideProducer, env.getValue("SOEKNAD_DOMAIN_URL"))

		adressebeskyttelseService =
			systemPdlHttpClient()
				.also { closables.add(it::close) }
				.let { AdressebeskyttelseService(AdressebeskyttelseKlient(it, System.getenv("PDL_URL"))) }

		soeknadService = SoeknadService(db, utkastPubliserer, adressebeskyttelseService)

		kodeverkService =
			kodeverkHttpClient()
				.also { closables.add(it::close) }
				.let { KodeverkService(KodeverkKlient(it, System.getenv("KODEVERK_URL"))) }

		krrKlient =
			tokenSecuredEndpoint(config.getConfig("no.nav.etterlatte.tjenester.krr"))
				.also { closables.add(it::close) }
				.let { KrrKlient(it) }

		personService = tokenSecuredEndpoint(config.getConfig("no.nav.etterlatte.tjenester.pdl"))
			.also { closables.add(it::close) }
			.let { PersonService(PersonKlient(it), kodeverkService, krrKlient) }
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

    private fun kodeverkHttpClient() =
        HttpClient(OkHttp) {
            install(ContentNegotiation) {
                jackson {
                    configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                    setSerializationInclusion(JsonInclude.Include.NON_NULL)
                    registerModule(JavaTimeModule())
                }
            }
        }

    // OBS: Denne klienten kaller PDL med en systembruker.
    // Informasjon fra denne klienten kan inneholde informasjon sluttbruker ikke har rett til å se.
    private fun systemPdlHttpClient() =
        HttpClient(OkHttp) {
            install(ContentNegotiation) { jackson() }
            install(Auth) {
                clientCredential {
                    config =
                        System
                            .getenv()
                            .toMutableMap()
                            .apply { put("AZURE_APP_OUTBOUND_SCOPE", requireNotNull(get("PDL_AZURE_SCOPE"))) }
                }
            }
        }
}


fun clusternavn(): String? = System.getenv()["NAIS_CLUSTER_NAME"]

enum class GcpEnv(
	val env: String
) {
	PROD("prod-gcp"),
	DEV("dev-gcp")
}

fun appIsInGCP(): Boolean =
	when (val naisClusterName = clusternavn()) {
		null -> false
		else -> GcpEnv.entries.map { it.env }.contains(naisClusterName)
	}
