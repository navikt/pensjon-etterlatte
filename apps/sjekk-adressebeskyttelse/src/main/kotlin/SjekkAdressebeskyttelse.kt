package no.nav.etterlatte

import com.fasterxml.jackson.databind.JsonNode
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.libs.common.adressebeskyttelse.Adressebeskyttelse.INGENBESKYTTELSE
import no.nav.etterlatte.libs.common.adressebeskyttelse.Graderinger
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import no.nav.helse.rapids_rivers.MessageProblems
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River
import no.nav.helse.rapids_rivers.isMissingOrNull


internal class SjekkAdressebeskyttelse(
    rapidsConnection: RapidsConnection,
    private val pdl: FinnAdressebeskyttelseForFnr
) :
    River.PacketListener {

    init {
        River(rapidsConnection).apply {
            validate { it.demandValue("@event_name", "soeknad_innsendt") }
            validate { it.requireKey("@fnr_liste") }
            validate { it.requireKey("@fnr_soeker") }
            validate { it.rejectKey("@adressebeskyttelse") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {

        val identer  = packet["@fnr_liste"].map { it.asText() } + packet["@fnr_soeker"].textValue()

        if(identer.isNotEmpty()) {
            runBlocking {

                //val gah = pdl.finnAdressebeskyttelseForFnr(identer)
                //println(gah.toString())
                val beskyttelse = pdl.finnAdressebeskyttelseForFnr(identer)
                    .flatMap { it.get("hentPersonBolk") }
                    .map { it.get("person") }
                    .map { it.get("adressebeskyttelse")[0] }
                    //.map { it.get("gradering") }
                    .map {finnGradering(it)}
                    .minByOrNull { it.ordinal } ?: Graderinger.INGEN_BESKYTTELSE


                packet["@adressebeskyttelse"] = beskyttelse.name
                println("vurdert adressebeskyttelse til ${beskyttelse.name}")
                context.publish(packet.toJson())
            }
        } else {
            packet["@adressebeskyttelse"] = INGENBESKYTTELSE
            println("hvabehager? Jeg kan ikke sjekke adressebeskyttelse uten å ha FNR")
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
fun finnGradering(node: JsonNode) : Graderinger {

   return if ( node.isMissingOrNull() || node.textValue() == "") {
         Graderinger.INGEN_BESKYTTELSE
    }
     else if (node.get("gradering").isMissingOrNull() || node.get("gradering").textValue() == ""){
       Graderinger.INGEN_BESKYTTELSE
   }
    else try {
         Graderinger.valueOf(node.get("gradering").textValue())
    } catch (e: IllegalArgumentException) {
        //Riktig default?
        Graderinger.STRENGT_FORTROLIG
    }
}

interface FinnAdressebeskyttelseForFnr {
    suspend fun finnAdressebeskyttelseForFnr(identer: List<String>): JsonNode
}
