package no.nav.etterlatte

import com.fasterxml.jackson.databind.JsonNode
import kotlinx.coroutines.runBlocking
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import no.nav.helse.rapids_rivers.MessageProblems
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River


internal class FinnFnrSoeknad(rapidsConnection: RapidsConnection) :
    River.PacketListener {

    init {
        River(rapidsConnection).apply {
            validate { it.demandValue("@event_name", "soeknad_innsendt") }
            validate { it.requireKey("@skjema_info") }
//            validate { it.requireKey("@template") }
//            validate { it.requireKey("@journalpostInfo") }
            validate { it.rejectKey("@fnr_liste") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {
        //println(packet["@skjema_info"].asText())


        runBlocking {

            packet["@fnr_liste"] = finnFnrForSkjema(packet["@skjema_info"])
            context.publish(packet.toJson())


            }
    }

    private fun finnFnrForSkjema(skjemainfo: JsonNode ): String {
        val regex = """\b(\d{11})\b""".toRegex()
        return regex.findAll(skjemainfo.toString())
            .map { it.groupValues[1] }
            .joinToString()

        //return JsonPath.parse(skjemainfo.toString())?.read("$..foedselsnummer")

    }

}

internal class Monitor(rapidsConnection: RapidsConnection) : River.PacketListener {

    init {
        River(rapidsConnection).apply {
            validate { it.demandValue("@event_name", "fnr_liste_laget") }
        }.register(this)
    }

    override fun onError(problems: MessageProblems, context: MessageContext) {
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {
        println(packet.toJson())
    }
}


