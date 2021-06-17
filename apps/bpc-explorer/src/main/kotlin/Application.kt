package no.nav.etterlatte

import io.ktor.application.call
import io.ktor.application.install
import io.ktor.features.ContentNegotiation
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.jackson.JacksonConverter
import io.ktor.response.respond
import io.ktor.response.respondText
import io.ktor.routing.get
import io.ktor.routing.routing
import io.ktor.server.cio.CIO
import io.ktor.server.engine.applicationEngineEnvironment
import io.ktor.server.engine.connector
import io.ktor.server.engine.embeddedServer

fun main(){
    Application(System.getenv()).start()
}

class Application (val env: Map<String, String>){
    val kafkaAdmin = KafkaAdmin(env)
    fun start(){
    embeddedServer(CIO, environment = applicationEngineEnvironment {
        module {
            install(ContentNegotiation) {
                register(ContentType.Application.Json, JacksonConverter())
            }

            routing {
                get("isalive") {
                    call.respondText("OK", ContentType.Text.Plain, HttpStatusCode.OK)
                }
                get("isready") {
                    call.respondText("OK", ContentType.Text.Plain, HttpStatusCode.OK)
                }
                get("topic"){
                    call.respond(kafkaAdmin.topic(env["KAFKA_RAPID_TOPIC"]!!))
                }
                get("groupoffset/{gruppe}"){
                    call.respond(kafkaAdmin.offsets(call.parameters["gruppe"]!!))
                }
            }

        }
        connector {
            port = 8080
        }
    }).start(true)
    }
}