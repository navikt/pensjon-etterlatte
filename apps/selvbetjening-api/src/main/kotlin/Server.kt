package no.nav.etterlatte

import io.ktor.application.ApplicationCallPipeline
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
import io.ktor.routing.Route
import io.ktor.routing.routing
import io.ktor.server.cio.CIO
import io.ktor.server.engine.applicationEngineEnvironment
import io.ktor.server.engine.connector
import io.ktor.server.engine.embeddedServer
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.asContextElement
import kotlinx.coroutines.withContext
import no.nav.etterlatte.health.healthApi
import no.nav.etterlatte.person.personApi
import no.nav.etterlatte.soknad.soknadApi
import no.nav.security.token.support.ktor.TokenValidationContextPrincipal
import no.nav.security.token.support.ktor.tokenValidationSupport
import org.slf4j.event.Level

class Server(private val applicationContext: ApplicationContext) {
    private val configuration = HoconApplicationConfig(applicationContext.config)

    private val personService = applicationContext.personService

    private val engine = embeddedServer(CIO, environment = applicationEngineEnvironment {
        module {
            install(ContentNegotiation) {
                jackson()
            }

            install(Authentication) {
                tokenValidationSupport(config = configuration)
            }

            install(CallLogging) {
                level = Level.INFO
                filter { call -> !call.request.path().startsWith("/internal") }
            }

            routing {
                healthApi()

                authenticate {
                    attachSecurityContext()

                    personApi(personService)
                    soknadApi(applicationContext.innsendtSoeknadEndpoint)
                }
            }

        }
        connector {
            port = 8080
        }
    })

    fun run() = engine.start(true)
}

fun Route.attachSecurityContext() {
    intercept(ApplicationCallPipeline.Call) {
        withContext(
            Dispatchers.Default + ThreadBoundSecCtx.asContextElement(
                value = TokenSecurityContext(
                    call.principal<TokenValidationContextPrincipal>()?.context!!
                )
            )
        ) {
            call.attributes
            proceed()
        }
    }
}
