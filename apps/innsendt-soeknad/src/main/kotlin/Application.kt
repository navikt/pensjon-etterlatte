package no.nav.etterlatte

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import io.ktor.serialization.jackson.jackson
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.auth.Authentication
import io.ktor.server.auth.authenticate
import io.ktor.server.auth.principal
import io.ktor.server.plugins.callloging.CallLogging
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.request.header
import io.ktor.server.request.path
import io.ktor.server.routing.IgnoreTrailingSlash
import io.ktor.server.routing.Route
import io.ktor.server.routing.RoutingContext
import io.ktor.server.routing.routing
import io.ktor.util.pipeline.PipelineContext
import no.nav.etterlatte.internal.healthApi
import no.nav.etterlatte.internal.metricsApi
import no.nav.etterlatte.internal.selftestApi
import no.nav.etterlatte.jobs.PubliserMetrikkerJobb
import no.nav.etterlatte.jobs.PubliserTilstandJobb
import no.nav.etterlatte.kodeverk.kodeverkApi
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.libs.utils.logging.CORRELATION_ID
import no.nav.etterlatte.libs.utils.logging.X_CORRELATION_ID
import no.nav.etterlatte.person.personApi
import no.nav.etterlatte.sak.sak
import no.nav.etterlatte.soeknad.soknadApi
import no.nav.helse.rapids_rivers.RapidApplication
import no.nav.security.token.support.v2.TokenValidationContextPrincipal
import no.nav.security.token.support.v2.tokenValidationSupport
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.slf4j.event.Level
import java.util.Timer
import java.util.UUID
import java.util.concurrent.atomic.AtomicBoolean

val sikkerLogg: Logger = LoggerFactory.getLogger("sikkerLogg")

fun main() {
    val env =
        System.getenv().toMutableMap().apply {
            put("KAFKA_CONSUMER_GROUP_ID", get("NAIS_APP_NAME")!!.replace("-", ""))
        }

    val context = ApplicationContext(env)
    with(context) {
        RapidApplication
            .create(
                env = env,
                builder = {
                    withKtorModule {
                        apiModule(context) {
                            healthApi()
                            metricsApi()
                            selftestApi()
                            authenticate {
                                securityMediator.autentiser(this)
                                personApi(personService)
                                kodeverkApi(kodeverkService)
                                soknadApi(soeknadService)
                                sak(sakService)
                            }
                        }
                    }.build {
                        datasourceBuilder.migrate()
                    }.also { rapidConnection ->
                        JournalpostSkrevet(rapidConnection, db)
                        BehandlingOpprettetGjenny(rapidConnection, db)

                        PubliserTilstandJobb(db, SoeknadPubliserer(rapidConnection, db), utkastPubliserer)
                            .schedule()
                            .addShutdownHook()

                        PubliserMetrikkerJobb(db)
                            .schedule()
                            .addShutdownHook()
                    }
                },
            ).start()
    }
}

fun RoutingContext.fnrFromToken() =
    call
        .principal<TokenValidationContextPrincipal>()
        ?.context
        ?.firstValidToken
        ?.jwtTokenClaims
        ?.get("pid")!!
        .toString()
        .let { Foedselsnummer.of(it) }

fun Application.apiModule(
    context: ApplicationContext,
    routes: Route.() -> Unit,
) {
    install(Authentication) {
        tokenValidationSupport(config = context.hoconApplicationConfig)
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
        routes()
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