package no.nav.etterlatte

import io.ktor.application.call
import io.ktor.http.ContentType
import io.ktor.response.respondText
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

fun main() {

    val datasourceBuilder = DataSourceBuilder(System.getenv())
    var rapid: SoeknadPubliserer? = null
    val db = SoeknadDao(datasourceBuilder.getDataSource())


    RapidApplication.Builder(RapidApplication.RapidApplicationConfig.fromEnv(System.getenv())).withKtorModule {
        routing {
            get("/api/soeknad") {
                val lagretSoknad = db.nySoeknad(UlagretSoeknad("abc", "{}"))
                GlobalScope.launch {
                    rapid!!.publiser(lagretSoknad)
                }
                call.respondText("", ContentType.Text.Plain)
            }
        }
    }.build()
        .apply {
            rapid = SoeknadPubliserer(this, db)
            register(object: RapidsConnection.StatusListener{
                override fun onStartup(rapidsConnection: RapidsConnection) {
                    datasourceBuilder.migrate()
                    GlobalScope.launch {
                        while(true) {
                            delay(600_000)
                            db.usendteSoeknader().forEach {
                                rapid!!.publiser(it)
                            }
                        }
                    }
                }
            })
            JournalpostSkrevet(this, db)
        }.start()
}


internal class JournalpostSkrevet(rapidsConnection: RapidsConnection, private val soeknader: SoeknadDao) :
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
