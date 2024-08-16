package no.nav.etterlatte

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.typesafe.config.Config
import com.typesafe.config.ConfigFactory
import io.ktor.auth.SecurityContextMediatorFactory
import io.ktor.client.HttpClient
import io.ktor.client.engine.okhttp.OkHttp
import io.ktor.client.plugins.auth.Auth
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.plugins.defaultRequest
import io.ktor.http.encodedPath
import io.ktor.http.takeFrom
import io.ktor.serialization.jackson.jackson
import no.nav.etterlatte.kafka.GcpKafkaConfig
import no.nav.etterlatte.kafka.TestProdusent
import no.nav.etterlatte.kafka.standardProducer
import no.nav.etterlatte.ktortokenexchange.bearerToken
import no.nav.etterlatte.person.KodeverkService
import no.nav.etterlatte.person.PersonKlient
import no.nav.etterlatte.person.PersonService
import no.nav.etterlatte.person.krr.KrrKlient
import no.nav.etterlatte.soeknad.SoeknadService
import soeknad.PostgresSoeknadRepository

class ApplicationContext(env: Map<String, String>) {

	private val closables = mutableListOf<() -> Unit>()
	private val config: Config = ConfigFactory.load()

	val securityMediator = SecurityContextMediatorFactory.from(config)

	val datasourceBuilder: DataSourceBuilder = DataSourceBuilder(System.getenv())
	val db: PostgresSoeknadRepository = PostgresSoeknadRepository.using(datasourceBuilder.dataSource)

	val utkastPubliserer: UtkastPubliserer
	val soeknadService: SoeknadService

	val kodeverkService: KodeverkService

	val personService: PersonService

	private val krrKlient: KrrKlient

	init {

		val minsideProducer = if (appIsInGCP()) {
			GcpKafkaConfig.fromEnv(env).standardProducer(env.getValue("KAFKA_UTKAST_TOPIC"))
		} else {
			TestProdusent()
		}
		utkastPubliserer = UtkastPubliserer(minsideProducer, env.getValue("SOEKNAD_DOMAIN_URL"))

		soeknadService = SoeknadService(db, utkastPubliserer)

		kodeverkService = KodeverkService() // TODO erstatt

		krrKlient =
			tokenSecuredEndpoint(config.getConfig("no.nav.etterlatte.tjenester.krr"))
				.also { closables.add(it::close) }
				.let { KrrKlient(it) }

		personService = tokenSecuredEndpoint(config.getConfig("no.nav.etterlatte.tjenester.pdl"))
			.also { closables.add(it::close) }
			.let { PersonService(PersonKlient(it), kodeverkService, krrKlient) }
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
				bearerToken {
					tokenprovider = securityMediator.outgoingToken(endpointConfig.getString("audience"))
				}
			}

			defaultRequest {
				url.takeFrom(endpointConfig.getString("url") + url.encodedPath)
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
