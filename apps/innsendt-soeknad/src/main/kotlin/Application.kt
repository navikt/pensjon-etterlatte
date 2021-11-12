package no.nav.etterlatte

import com.typesafe.config.ConfigFactory
import io.ktor.application.*
import io.ktor.auth.*
import io.ktor.config.*
import io.ktor.features.*
import io.ktor.jackson.*
import io.ktor.routing.*
import io.ktor.util.pipeline.*
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.jobs.TilstandsProbe
import no.nav.etterlatte.jobs.TilstandsPusher
import no.nav.helse.rapids_rivers.RapidApplication
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.security.token.support.ktor.TokenValidationContextPrincipal
import no.nav.security.token.support.ktor.tokenValidationSupport
import soeknad.PostgresSoeknadRepository
import soeknad.soeknadApi

fun main() {
    val datasourceBuilder = DataSourceBuilder(System.getenv())
    val db = PostgresSoeknadRepository.using(datasourceBuilder.dataSource)

    val env = System.getenv().toMutableMap().apply {
        put("KAFKA_CONSUMER_GROUP_ID", get("NAIS_APP_NAME")!!.replace("-", ""))
    }
    val rapidApplication = RapidApplication.Builder(RapidApplication.RapidApplicationConfig.fromEnv(env))
        .withKtorModule { apiModule { soeknadApi(db) } }
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

fun Application.apiModule(routes: Route.() -> Unit) {
    install(Authentication) {
        tokenValidationSupport(config = HoconApplicationConfig(ConfigFactory.load()))
    }
    install(ContentNegotiation) {
        jackson()
    }
    install(IgnoreTrailingSlash)

    routing {
        authenticate {
            routes()
        }
    }
}
