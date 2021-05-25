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
            //validate { it.requireKey("@skjema_info") }
            validate { it.requireKey("@fnr_liste") }
            validate { it.rejectKey("@adressebeskyttelse") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {

        val identer: List<String> = packet["@fnr_liste"].map { it.asText() }

        runBlocking {
            val graderinger = pdl.finnAdressebeskyttelseForFnr(identer)
                .flatMap { it.get("hentPersonBolk") }
                .map { it.get("adressebeskyttelse") }
                .map { it.get("gradering") }

            var beskyttelse = INGENBESKYTTELSE

            for (i in 0 until graderinger.size)
                when (graderinger[i].textValue()) {
                    KODE6 -> beskyttelse = KODE6
                    KODE19 -> if (beskyttelse != KODE6) {
                        beskyttelse = KODE19
                    }
                    KODE7 -> if (beskyttelse != KODE6 && beskyttelse != KODE19) {
                        beskyttelse = KODE7
                    }
                }
            packet["@adressebeskyttelse"] = beskyttelse

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
    suspend fun finnAdressebeskyttelseForFnr(identer: List<String>): JsonNode
}
