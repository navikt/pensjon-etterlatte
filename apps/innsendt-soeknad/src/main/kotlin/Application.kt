package no.nav.etterlatte

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.typesafe.config.ConfigFactory
import io.ktor.application.Application
import io.ktor.application.ApplicationCall
import io.ktor.application.call
import io.ktor.application.install
import io.ktor.auth.Authentication
import io.ktor.auth.authenticate
import io.ktor.auth.principal
import io.ktor.config.HoconApplicationConfig
import io.ktor.features.CallLogging
import io.ktor.features.ContentNegotiation
import io.ktor.jackson.jackson
import io.ktor.request.path
import io.ktor.routing.IgnoreTrailingSlash
import io.ktor.routing.Route
import io.ktor.routing.routing
import io.ktor.util.pipeline.PipelineContext
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.jobs.TilstandsProbe
import no.nav.etterlatte.jobs.TilstandsPusher
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.soeknad.SoeknadService
import no.nav.helse.rapids_rivers.RapidApplication
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.security.token.support.ktor.TokenValidationContextPrincipal
import no.nav.security.token.support.ktor.tokenValidationSupport
import org.slf4j.event.Level
import soeknad.PostgresSoeknadRepository
import soeknad.soeknadApi

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
        filter { call -> !call.request.path().startsWith("/internal") }
    }

    routing {
        authenticate {
            routes()
        }
    }
}
