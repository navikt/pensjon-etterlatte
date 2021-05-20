package no.nav.etterlatte

import kotlinx.coroutines.runBlocking
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import no.nav.helse.rapids_rivers.MessageProblems
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River


internal class SjekkAdressebeskyttelse(rapidsConnection: RapidsConnection, private val pdl: FinnAdressebeskyttelseForFnr) :
    River.PacketListener {

    init {
        River(rapidsConnection).apply {
            validate { it.demandValue("@event_name", "soeknad_innsendt") }
            validate { it.requireKey("@skjema_info") }
            validate { it.requireKey("@fnr_liste") }
            validate { it.rejectKey("@adressebeskyttelse") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {
        println(packet["@fnr_liste"].asText())

        runBlocking {
            packet["@adressebeskyttelse"] = pdl.finnAdressebeskyttelseForFnr(packet["@fnr_liste"].asText())
            context.publish(packet.toJson())
        }
    }
}


internal class Monitor(rapidsConnection: RapidsConnection) : River.PacketListener {

    init {
        River(rapidsConnection).apply {
            validate { it.demandValue("@event_name", "soeknad_innsendt") }
        }.register(this)
    }

    override fun onError(problems: MessageProblems, context: MessageContext) {
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {
        println(packet.toJson())
    }
}

interface FinnAdressebeskyttelseForFnr {
    suspend fun finnAdressebeskyttelseForFnr(forelder: String): List<String>
}
