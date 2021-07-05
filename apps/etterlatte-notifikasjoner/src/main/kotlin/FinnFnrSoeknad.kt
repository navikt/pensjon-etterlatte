package no.nav.etterlatte

import kotlinx.coroutines.runBlocking
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River


internal class FinnFnrSoeknad(rapidsConnection: RapidsConnection) :
    River.PacketListener {

    init {
        River(rapidsConnection).apply {
            validate { it.demandValue("@event_name", "soeknad_innsendt") }
            validate { it.requireKey("@skjema_info") }
            validate { it.rejectKey("@fnr_liste") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {


        runBlocking {

            //val brukere = finnFnrForSkjema(packet["@skjema_info"])
            //println("fant følgende brukere: $brukere")
            //packet["@fnr_liste"] = brukere
            context.publish(packet.toJson())


            }
    }
}



