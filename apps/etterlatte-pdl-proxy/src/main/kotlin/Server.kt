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

class Server(applicationContext: ApplicationContext) {
    private val securityContext = applicationContext.securityMediator
    private val pdlconfig = applicationContext.pdl

    private val engine = embeddedServer(CIO, environment = applicationEngineEnvironment {
        module {
            install(ContentNegotiation) { jackson() }
            installAuthUsing(securityContext)

            install(CallLogging) {
                filter { call -> !call.request.path().startsWith("/internal") }
            }

            routing {
                internal()
                secureRoutUsing(securityContext){
                    pdl(pdlconfig, applicationContext)
                }
                authenticate("tokenX") {
                    route("/tokenx") {
                        pdl(pdlconfig, applicationContext)
                    }
                }
            }
        }
        connector { port = 8080 }
    })

    fun run() = engine.start(true)
}

