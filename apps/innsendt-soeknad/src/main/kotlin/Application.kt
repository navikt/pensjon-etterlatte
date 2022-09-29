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
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.jobs.TilstandsProbe
import no.nav.etterlatte.jobs.TilstandsPusher
import no.nav.etterlatte.libs.common.logging.CORRELATION_ID
import no.nav.etterlatte.libs.common.logging.X_CORRELATION_ID
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.soeknad.SoeknadService
import no.nav.helse.rapids_rivers.RapidApplication
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.security.token.support.v2.TokenValidationContextPrincipal
import no.nav.security.token.support.v2.tokenValidationSupport
import org.slf4j.event.Level
import soeknad.PostgresSoeknadRepository
import soeknad.soeknadApi
import java.util.*

fun main() {
    val datasourceBuilder = DataSourceBuilder(System.getenv())
    val db = PostgresSoeknadRepository.using(datasourceBuilder.dataSource)

    val env = System.getenv().toMutableMap().apply {
        put("KAFKA_CONSUMER_GROUP_ID", get("NAIS_APP_NAME")!!.replace("-", ""))
    }
    val rapidApplication = RapidApplication.Builder(RapidApplication.RapidApplicationConfig.fromEnv(env))
        .withKtorModule { apiModule { soeknadApi(SoeknadService(db)) } }
        .build().also { rapidConnection ->
            rapidConnection.register(object : RapidsConnection.StatusListener {
                val running = Job()
                val workers = mutableListOf<Job>()
                override fun onStartup(rapidsConnection: RapidsConnection) {
                    datasourceBuilder.migrate()
                    workers += GlobalScope.launch {
                        TilstandsPusher(db, SoeknadPubliserer(rapidsConnection, db)).start(running)
                    }
                    workers += GlobalScope.launch {
                        TilstandsProbe(db).start(running)
                    }
                }

                override fun onShutdown(rapidsConnection: RapidsConnection) {
                    running.complete()
                    runBlocking {
                        GlobalScope.launch {
                            workers.forEach {
                                it.join()
                            }
                        }.join()
                    }
                }
            })

            JournalpostSkrevet(rapidConnection, db)
        }

    rapidApplication.start()
}

fun PipelineContext<Unit, ApplicationCall>.fnrFromToken() = call.principal<TokenValidationContextPrincipal>()
    ?.context?.firstValidToken?.get()?.jwtTokenClaims?.get("pid")!!.toString()
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
        filter { call -> !call.request.path().matches(Regex(".*/isready|.*/isalive")) }
        mdc(CORRELATION_ID) { call -> call.request.header(X_CORRELATION_ID) ?: UUID.randomUUID().toString() }
    }

    routing {
        authenticate {
            routes()
        }
    }
}
