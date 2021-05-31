package no.nav.etterlatte

import com.fasterxml.jackson.databind.JsonNode
import kotlinx.coroutines.runBlocking
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import no.nav.helse.rapids_rivers.MessageProblems
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River


internal class SjekkAdressebeskyttelse(
    rapidsConnection: RapidsConnection,
    private val pdl: FinnAdressebeskyttelseForFnr
) :
    River.PacketListener {
    val KODE6 = "STRENGT_FORTROLIG"
    val KODE7 = "FORTROLIG"
    val KODE19 = "STRENGT_FORTROLIG_UTLAND"
    val INGENBESKYTTELSE = "INGEN BESKYTTELSE"

    init {
        River(rapidsConnection).apply {
            validate { it.demandValue("@event_name", "soeknad_innsendt") }
            validate { it.requireKey("@fnr_liste") }
            validate { it.requireKey("@fnr_soeker") }
            validate { it.rejectKey("@adressebeskyttelse") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {

        val identer: List<String> = packet["@fnr_liste"].map { it.asText() }
        if(identer.isNotEmpty()) {
            runBlocking {

                //Denne ble litt stygg, men skal i teorien sjekke beskyttelse på soeker
                var beskyttelse: String = pdl.finnAdressebeskyttelseForFnr(listOf(packet["@fnr_soeker"].asText())).textValue()

                val graderinger = pdl.finnAdressebeskyttelseForFnr(identer)
                    .flatMap { it.get("hentPersonBolk") }
                    .map { it.get("adressebeskyttelse") }
                    .map { it.get("gradering") }

                //var beskyttelse = INGENBESKYTTELSE

                for (element in graderinger)
                    when (element.textValue()) {
                        KODE6 -> beskyttelse = KODE6
                        KODE19 -> if (beskyttelse != KODE6) {
                            beskyttelse = KODE19
                        }
                        KODE7 -> if (beskyttelse != KODE6 && beskyttelse != KODE19) {
                            beskyttelse = KODE7
                        }
                    }
                packet["@adressebeskyttelse"] = beskyttelse
                println("vurdert adressebeskyttelse til $beskyttelse")
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

interface FinnAdressebeskyttelseForFnr {
    suspend fun finnAdressebeskyttelseForFnr(identer: List<String>): JsonNode
}
