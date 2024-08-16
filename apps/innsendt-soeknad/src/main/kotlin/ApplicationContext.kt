package no.nav.etterlatte

import com.typesafe.config.Config
import com.typesafe.config.ConfigFactory
import io.ktor.auth.SecurityContextMediatorFactory
import no.nav.etterlatte.kafka.GcpKafkaConfig
import no.nav.etterlatte.kafka.TestProdusent
import no.nav.etterlatte.kafka.standardProducer
import no.nav.etterlatte.soeknad.SoeknadService
import soeknad.PostgresSoeknadRepository

class ApplicationContext(env: Map<String, String>) {

	private val config: Config = ConfigFactory.load()

	val datasourceBuilder: DataSourceBuilder = DataSourceBuilder(System.getenv())
	val db: PostgresSoeknadRepository = PostgresSoeknadRepository.using(datasourceBuilder.dataSource)

	val utkastPubliserer: UtkastPubliserer
	val soeknadService: SoeknadService

	val securityMediator = SecurityContextMediatorFactory.from(config)

	init {

		val minsideProducer = if (appIsInGCP()) {
			GcpKafkaConfig.fromEnv(env).standardProducer(env.getValue("KAFKA_UTKAST_TOPIC"))
		} else {
			TestProdusent()
		}
		utkastPubliserer = UtkastPubliserer(minsideProducer, env.getValue("SOEKNAD_DOMAIN_URL"))

		soeknadService = SoeknadService(db, utkastPubliserer)
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
