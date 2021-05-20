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
            .filter { validateControlDigits(it.value) }
            .map { it.groupValues[1] }
            .joinToString()
    }

    //private fun validerFnr(fnr: String): Boolean {
     //   //TODO()
     //   return true
    //}
    private fun validateControlDigits(value:String): Boolean {
        val controlDigits1 = intArrayOf(3, 7, 6, 1, 8, 9, 4, 5, 2)
        val controlDigits2 = intArrayOf(5, 4, 3, 2, 7, 6, 5, 4, 3, 2)
        val ks1 = Character.getNumericValue(value[9])
        println(value)
        val c1 = mod(controlDigits1, value)
        println("modulo1: $c1")
        println("kontrollsiffer: $ks1")
        if (c1 == 10 || c1 != ks1) {
            return false
        }

        val c2 = mod(controlDigits2, value)
        println("modulo2: $c2")
        if (c2 == 10 || c2 != Character.getNumericValue(value[10])) {
            return false
        }

        return true
    }
    private fun mod(arr: IntArray, value:String): Int {
        val sum = arr.withIndex()
            .sumBy { (i, m) -> m * Character.getNumericValue(value[i]) }

        val result = 11 - (sum % 11)
        return if (result == 11) 0 else result
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


