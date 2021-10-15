package no.nav.etterlatte

import io.ktor.application.install
import io.ktor.auth.authenticate
import io.ktor.features.CallLogging
import io.ktor.features.ContentNegotiation
import io.ktor.jackson.jackson
import io.ktor.request.path
import io.ktor.routing.route
import io.ktor.routing.routing
import io.ktor.server.cio.CIO
import io.ktor.server.engine.applicationEngineEnvironment
import io.ktor.server.engine.connector
import io.ktor.server.engine.embeddedServer
import no.nav.etterlatte.ktortokenexchange.installAuthUsing
import no.nav.etterlatte.ktortokenexchange.secureRoutUsing
import no.nav.etterlatte.routes.internal
import no.nav.etterlatte.routes.pdl


fun applicationEngineEnvironment(applicationContext: ApplicationContext) =
    applicationEngineEnvironment {
        module {
            install(ContentNegotiation) { jackson() }
            installAuthUsing(applicationContext.securityMediator)

            install(CallLogging) {
                filter { call -> !call.request.path().startsWith("/internal") }
            }

            routing {
                internal()
                secureRoutUsing(applicationContext.securityMediator) {
                    pdl(applicationContext.pdl, applicationContext)
                }
                authenticate {
                    route("/tokenx") {
                        pdl(applicationContext.pdl, applicationContext)
                    }
                }
            }
        }
        connector { port = 8080 }
    }

class Server(applicationContext: ApplicationContext) {
    private val engine = embeddedServer(CIO, environment = applicationEngineEnvironment(applicationContext))



    fun run() = engine.start(true)
}

