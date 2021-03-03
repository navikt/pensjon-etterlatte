package no.nav.etterlatte

import io.ktor.application.Application
import io.ktor.application.call
import io.ktor.http.ContentType
import io.ktor.response.respondText
import io.ktor.routing.get
import io.ktor.routing.routing
import no.nav.etterlatte.leesah.ILivetErEnStroemAvHendelser
import no.nav.etterlatte.leesah.LivetErEnStroemAvHendelser
import no.nav.person.pdl.leesah.Personhendelse


fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

@Suppress("unused") // Referenced in application.conf
@kotlin.jvm.JvmOverloads
fun Application.module(testing: Boolean = false) {

    val config = if(testing)TestConfig() else DevConfig()

    val stream = if(config.enableKafka){
        val livshendelser: ILivetErEnStroemAvHendelser = LivetErEnStroemAvHendelser(config.env)
        val dodshendelser:IDodsmeldinger = Dodsmeldinger(config)
        FinnDodsmeldinger(livshendelser, dodshendelser)
    } else {
        null
    }


    routing {
        get("/") {
            call.respondText("Environment: " + System.getenv().keys.joinToString(","), contentType = ContentType.Text.Plain)
        }

        get("/kafka") {

            val meldinger = mutableListOf<Personhendelse>()

            stream?.stream()
            if(meldinger.isEmpty()){
                call.respondText("Iterasjoner: ${stream?.iterasjoner}, Dødsmeldinger ${stream?.dodsmeldinger} av ${stream?.meldinger}", contentType = ContentType.Text.Plain)
            }
        }
        get("/fromstart") {

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

