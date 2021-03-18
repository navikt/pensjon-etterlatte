package no.nav.etterlatte

import com.typesafe.config.ConfigFactory
import io.ktor.application.call
import io.ktor.application.install
import io.ktor.auth.Authentication
import io.ktor.auth.authenticate
import io.ktor.config.HoconApplicationConfig
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
import io.ktor.util.KtorExperimentalAPI
import no.nav.security.token.support.ktor.tokenValidationSupport


@KtorExperimentalAPI
fun main() {
    embeddedServer(Netty, environment = applicationEngineEnvironment {
        module {
            config = HoconApplicationConfig(ConfigFactory.load())
            install(ContentNegotiation) {
                jackson()
            }

            install(Authentication) {
                tokenValidationSupport(config = config)
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
                authenticate {
                    route("secure") {
                        get {
                            call.respond(HttpStatusCode.OK, Pair("navn", "Ola Nordmann"))
                        }
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
