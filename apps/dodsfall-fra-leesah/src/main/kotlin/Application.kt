package no.nav.etterlatte

import io.ktor.application.Application
import io.ktor.application.call
import io.ktor.http.ContentType
import io.ktor.response.respondText
import io.ktor.routing.get
import io.ktor.routing.routing
import io.ktor.server.engine.applicationEngineEnvironment
import io.ktor.server.engine.connector
import io.ktor.server.engine.embeddedServer
import io.ktor.server.netty.Netty
import kotlinx.coroutines.delay
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.leesah.ILivetErEnStroemAvHendelser
import no.nav.etterlatte.leesah.LivetErEnStroemAvHendelser
var stream:FinnDodsmeldinger?=null


fun main() {
    embeddedServer(Netty, environment = applicationEngineEnvironment {
        module(Application::module)

        connector {
            port = 8080
        }
    }
    ).apply {
        Runtime.getRuntime().addShutdownHook(Thread {
            stop(3000, 3000)
        })
    }.start(false)

    val config = DevConfig()
    stream = if(config.enableKafka){
        val livshendelser: ILivetErEnStroemAvHendelser = LivetErEnStroemAvHendelser(config.env)
        val dodshendelser:IDodsmeldinger = Dodsmeldinger(config)
        FinnDodsmeldinger(livshendelser, dodshendelser)
    } else {
        null
    }

    while(true){
        if(stream?.stopped == true) {
        runBlocking {
            delay(200)
            }
        } else {
            stream?.stream()
        }
    }
}

@Suppress("unused") // Referenced in application.conf
fun Application.module() {

    routing {
        get("/") {
            call.respondText("Environment: " + System.getenv().keys.joinToString(","), contentType = ContentType.Text.Plain)
        }
        get("/start") {
            stream?.start()
            call.respondText("Starting leesah stream", contentType = ContentType.Text.Plain)
        }
        get("/status") {
            call.respondText("Iterasjoner: ${stream?.iterasjoner}, Dødsmeldinger ${stream?.dodsmeldinger} av ${stream?.meldinger}", contentType = ContentType.Text.Plain)
        }
        get("/stop") {
            stream?.stop()
            call.respondText("Stopped reading messages", contentType = ContentType.Text.Plain)
        }
        get("/fromstart") {
            stream?.fraStart()
            call.respondText("partition has been set to start", contentType = ContentType.Text.Plain)
        }
        get("/isAlive") {
            call.respondText("JADDA!", contentType = ContentType.Text.Plain)
        }
        get("/isReady") {
            call.respondText("JADDA!", contentType = ContentType.Text.Plain)
        }
    }
}

