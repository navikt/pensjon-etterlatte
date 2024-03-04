package no.nav.etterlatte

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.typesafe.config.ConfigFactory
import io.ktor.serialization.jackson.jackson
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.application.Application
import io.ktor.server.application.ApplicationCall
import io.ktor.server.application.call
import io.ktor.server.application.install
import io.ktor.server.auth.Authentication
import io.ktor.server.auth.authenticate
import io.ktor.server.auth.principal
import io.ktor.server.config.HoconApplicationConfig
import io.ktor.server.plugins.callloging.CallLogging
import io.ktor.server.request.header
import io.ktor.server.request.path
import io.ktor.server.routing.IgnoreTrailingSlash
import io.ktor.server.routing.Route
import io.ktor.server.routing.routing
import io.ktor.util.pipeline.PipelineContext
import no.nav.etterlatte.jobs.PubliserMetrikkerJobb
import no.nav.etterlatte.jobs.PubliserTilstandJobb
import no.nav.etterlatte.kafka.GcpKafkaConfig
import no.nav.etterlatte.kafka.TestProdusent
import no.nav.etterlatte.kafka.standardProducer
import no.nav.etterlatte.libs.common.logging.CORRELATION_ID
import no.nav.etterlatte.libs.common.logging.X_CORRELATION_ID
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.soeknad.SoeknadService
import no.nav.helse.rapids_rivers.RapidApplication
import no.nav.security.token.support.v2.TokenValidationContextPrincipal
import no.nav.security.token.support.v2.tokenValidationSupport
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.slf4j.event.Level
import soeknad.PostgresSoeknadRepository
import soeknad.soeknadApi
import java.util.*
import java.util.concurrent.atomic.AtomicBoolean

val sikkerLogg: Logger = LoggerFactory.getLogger("sikkerLogg")

fun clusternavn(): String? = System.getenv()["NAIS_CLUSTER_NAME"]

enum class GcpEnv(val env: String) {
    PROD("prod-gcp"),
    DEV("dev-gcp"),
}
fun appIsInGCP(): Boolean {
    return when (val naisClusterName = clusternavn()) {
        null -> false
        else -> GcpEnv.entries.map { it.env }.contains(naisClusterName)
    }
}

fun main() {
    val datasourceBuilder = DataSourceBuilder(System.getenv())
    val db = PostgresSoeknadRepository.using(datasourceBuilder.dataSource)
    val env = System.getenv().toMutableMap().apply {
        put("KAFKA_CONSUMER_GROUP_ID", get("NAIS_APP_NAME")!!.replace("-", ""))
    }
    val minsideProducer =
        if(appIsInGCP()) {
            GcpKafkaConfig.fromEnv(env).standardProducer(env.getValue("KAFKA_UTKAST_TOPIC"))
        } else {
            TestProdusent()
        }
    val utkastPubliserer = UtkastPubliserer(minsideProducer, env.getValue("SOEKNAD_DOMAIN_URL"))
    val rapidApplication = RapidApplication.Builder(RapidApplication.RapidApplicationConfig.fromEnv(env))
        .withKtorModule { apiModule { soeknadApi(SoeknadService(db, utkastPubliserer))} }
        .build().also { rapidConnection ->
            JournalpostSkrevet(rapidConnection, db)
            BehandlingOpprettetDoffen(rapidConnection, db)

            PubliserTilstandJobb(db, SoeknadPubliserer(rapidConnection, db), utkastPubliserer)
                .schedule().addShutdownHook()

            PubliserMetrikkerJobb(db)
                .schedule().addShutdownHook()
        }
    rapidApplication.start()
}

fun PipelineContext<Unit, ApplicationCall>.fnrFromToken() = call.principal<TokenValidationContextPrincipal>()
    ?.context?.firstValidToken?.jwtTokenClaims?.get("pid")!!.toString()
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
        authenticate {
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
        }
    )
