package no.nav.etterlatte

import io.ktor.application.call
import io.ktor.http.ContentType
import io.ktor.response.respondText
import io.ktor.routing.Route
import io.ktor.routing.get
import io.ktor.routing.routing
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import no.nav.helse.rapids_rivers.RapidApplication
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River

fun Route.soeknadApi(db: SoeknadRepository){
     get("/api/soeknad") {
            db.nySoeknad(UlagretSoeknad("abc", "{}"))
            call.respondText("", ContentType.Text.Plain)
        }
}


fun main() {
    val datasourceBuilder = DataSourceBuilder(System.getenv())
    val db = PostgresSoeknadRepository.using(datasourceBuilder.getDataSource())

    val rapidApplication = RapidApplication.Builder(RapidApplication.RapidApplicationConfig.fromEnv(System.getenv()))
        .withKtorModule {
            routing {
                soeknadApi(db)
            }
        }.build().also { rapidConnection ->
            rapidConnection.register(object: RapidsConnection.StatusListener{
                override fun onStartup(rapidsConnection: RapidsConnection) {
                    datasourceBuilder.migrate()
                    GlobalScope.launch {
                        val rapid = SoeknadPubliserer(rapidsConnection, db)
                        while(true) {
                            delay(600_000)
                            db.usendteSoeknader().forEach {
                                rapid.publiser(it)
                            }
                        }
                    }
                }
            })
            JournalpostSkrevet(rapidConnection, db)
        }


    rapidApplication.start()
}


internal class JournalpostSkrevet(rapidsConnection: RapidsConnection, private val soeknader: SoeknadRepository) :
    River.PacketListener {

    init {
        River(rapidsConnection).apply {
            validate { it.requireKey("@journalpostId") }
            validate { it.requireKey("@lagret_soeknad_id") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {
        soeknader.soeknadJournalfoert(LagretSoeknad("", "", packet["@lagret_soeknad_id"].asLong()))
    }
}


