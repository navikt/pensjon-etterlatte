package no.nav.etterlatte

import io.ktor.application.call
import io.ktor.application.install
import io.ktor.features.CORS
import io.ktor.features.ContentNegotiation
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.jackson.jackson
import io.ktor.response.respond
import io.ktor.response.respondText
import io.ktor.routing.get
import io.ktor.routing.route
import io.ktor.routing.routing
import io.ktor.server.engine.applicationEngineEnvironment
import io.ktor.server.engine.connector
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty


fun main() {
    embeddedServer(Netty, environment = applicationEngineEnvironment {
        module {
            install(ContentNegotiation) {
                jackson()
            }

            install(CORS) {
                host("localhost:3000")

                allowCredentials = true
            }

            routing {
                route("internal") {
                    get("isalive") {
                        call.respondText("JADDA!", contentType = ContentType.Text.Plain)
                    }
                    get("isready") {
                        call.respondText("JADDA!", contentType = ContentType.Text.Plain)
                    }
                }
                route("api") {
                    get {
                        call.respond(HttpStatusCode.OK, Pair("navn", "Ola Nordmann"))
                    }
                }
            }
        }

        connector {
            port = 8080
        }
    }
    ).apply {
        Runtime.getRuntime().addShutdownHook(Thread {
            stop(3000, 3000)
        })
    }.start(true)

}
