package no.nav.etterlatte

import io.ktor.application.call
import io.ktor.application.install
import io.ktor.auth.Authentication
import io.ktor.auth.authenticate
import io.ktor.config.HoconApplicationConfig
import io.ktor.features.ContentNegotiation
import io.ktor.http.HttpStatusCode
import io.ktor.jackson.jackson
import io.ktor.response.respond
import io.ktor.routing.get
import io.ktor.routing.route
import io.ktor.routing.routing
import io.ktor.server.engine.applicationEngineEnvironment
import io.ktor.server.engine.connector
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import no.nav.etterlatte.health.healthApi
import no.nav.etterlatte.person.PersonClient
import no.nav.etterlatte.person.personApi
import no.nav.security.token.support.ktor.tokenValidationSupport

class Server {
    val configuration = HoconApplicationConfig(ApplicationContext.config())
    val personClient = PersonClient(ApplicationContext.httpClient())
    val engine = embeddedServer(Netty, environment = applicationEngineEnvironment {
        module {

            install(ContentNegotiation) {
                jackson()
            }

            install(Authentication) {
                tokenValidationSupport(config = configuration)
            }


            routing {
                healthApi()
                personApi(personClient)

                route("api") {
                    get {
                        call.respond(HttpStatusCode.OK, PdlMock().personInfo(""))
                    }
                }
                authenticate {
                    route("secure") {
                        get {
                            call.respond(
                                HttpStatusCode.OK,
                                requestContext().let {
                                    BeanFactory.pdl(it).personInfo(it.securityContext().user()!!)
                                }
                            )

                        }
                    }
                }
            }
        }

        connector {
            port = 8080
        }
    }
    )


    fun run() = engine.start(true)
}