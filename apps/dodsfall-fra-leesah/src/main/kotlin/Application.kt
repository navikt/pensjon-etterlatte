package no.nav.etterlatte

import io.ktor.application.Application
import io.ktor.application.call
import io.ktor.http.ContentType
import io.ktor.response.respondText
import io.ktor.routing.get
import io.ktor.routing.routing
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import no.nav.etterlatte.leesah.LivetErEnStroemAvHendelser
import no.nav.helse.rapids_rivers.RapidApplication

var stream: FinnDodsmeldinger? = null


fun main() {
    RapidApplication.Builder(RapidApplication.RapidApplicationConfig.fromEnv(System.getenv()))
        .withKtorModule(Application::module)
        .build()
        .apply {
            GlobalScope.launch {
                stream = FinnDodsmeldinger(LivetErEnStroemAvHendelser(System.getenv()), DodsmeldingerRapid(this@apply))
                while (true) {
                    if (stream?.stopped == true) {
                        delay(200)
                    } else {
                        stream?.stream()
                    }
                }
            }
        }.start()

}

@Suppress("unused") // Referenced in application.conf
fun Application.module() {

    routing {
        get("/") {
            call.respondText(
                "Environment: " + System.getenv().keys.joinToString(","),
                contentType = ContentType.Text.Plain
            )
        }
        get("/start") {
            stream?.start()
            call.respondText("Starting leesah stream", contentType = ContentType.Text.Plain)
        }
        get("/status") {
            call.respondText(
                "Iterasjoner: ${stream?.iterasjoner}, Dødsmeldinger ${stream?.dodsmeldinger} av ${stream?.meldinger}",
                contentType = ContentType.Text.Plain
            )
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

