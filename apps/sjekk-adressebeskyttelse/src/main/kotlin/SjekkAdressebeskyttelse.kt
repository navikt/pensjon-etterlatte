package no.nav.etterlatte

import com.fasterxml.jackson.databind.JsonNode
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.libs.common.adressebeskyttelse.Adressebeskyttelse.INGENBESKYTTELSE
import no.nav.etterlatte.libs.common.adressebeskyttelse.Graderinger
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River
import no.nav.helse.rapids_rivers.isMissingOrNull
import org.slf4j.LoggerFactory


internal class SjekkAdressebeskyttelse(
    rapidsConnection: RapidsConnection,
    private val pdl: FinnAdressebeskyttelseForFnr
) :
    River.PacketListener {
    private val logger = LoggerFactory.getLogger("no.pensjon.etterlatte")
    init {
        River(rapidsConnection).apply {
            validate { it.requireKey("@fnr_liste") }
            validate { it.rejectKey("@adressebeskyttelse") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {

        val identer = packet["@fnr_liste"].map { it.asText() }
        if (identer.isNotEmpty()) {
            runBlocking {
                val beskyttelse = pdl.finnAdressebeskyttelseForFnr(identer)
                    .flatMap { it.get("hentPersonBolk") }
                    .mapNotNull { it.get("person") }
                    .mapNotNull { it.get("adressebeskyttelse") }
                    .map { finnGradering(it) }
                    .minByOrNull { it.ordinal } ?: Graderinger.INGEN_BESKYTTELSE

                packet["@adressebeskyttelse"] = beskyttelse.name
                logger.info("vurdert adressebeskyttelse til ${beskyttelse.name}")
                context.publish(packet.toJson())
            }
        } else {
            packet["@adressebeskyttelse"] = INGENBESKYTTELSE
            logger.error("hvabehager? Jeg kan ikke sjekke adressebeskyttelse uten å ha FNR")
        }
    }
}

fun finnGradering(nodes: JsonNode): Graderinger {

    val node = nodes[0]
    return if (nodes.isMissingOrNull() || nodes.toString() == "[]") {
        Graderinger.INGEN_BESKYTTELSE
    } else if (node.isMissingOrNull() || node.get("gradering").textValue() == "") {
        Graderinger.INGEN_BESKYTTELSE
    } else try {
        Graderinger.valueOf(node.get("gradering").textValue())
    } catch (e: IllegalArgumentException) {
        //Riktig default?
        Graderinger.STRENGT_FORTROLIG
    }
}

interface FinnAdressebeskyttelseForFnr {
    suspend fun finnAdressebeskyttelseForFnr(identer: List<String>): JsonNode
}
