package no.pensjon

import io.ktor.application.*
import io.ktor.response.*
import io.ktor.routing.*
import io.ktor.http.*
import no.nav.person.pdl.leesah.Personhendelse


fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

@Suppress("unused") // Referenced in application.conf
@kotlin.jvm.JvmOverloads
fun Application.module(testing: Boolean = false) {
    val stream = FinnDodsmeldinger(if(testing)TestConfig() else DevConfig())

    routing {
        get("/") {
            call.respondText("Environment: " + System.getenv().keys.joinToString(","), contentType = ContentType.Text.Plain)
        }

        get("/kafka") {

            val meldinger = mutableListOf<Personhendelse>()

            stream.stream()
            if(meldinger.isEmpty()){
                call.respondText("Iterasjoner: ${stream.iterasjoner}, Dødsmeldinger${stream.dodsmeldinger}av ${stream.meldinger}", contentType = ContentType.Text.Plain)
            }
        }
        get("/fromstart") {
            //hendelser.fraStart()
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

