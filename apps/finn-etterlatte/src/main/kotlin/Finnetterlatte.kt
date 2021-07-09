package no.nav.etterlatte

import kotlinx.coroutines.runBlocking
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import no.nav.helse.rapids_rivers.MessageProblems
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River
import org.slf4j.LoggerFactory


internal class FinnEtterlatte(rapidsConnection: RapidsConnection, private val pdl: FinnEtterlatteForPerson) :
    River.PacketListener {
    val logger = LoggerFactory.getLogger("no.pensjon.etterlatte")
    init {
        River(rapidsConnection).apply {
            validate { it.demandValue("@event_name", "person_dod") }
            validate { it.requireKey("@avdod_ident") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {


        runBlocking {
            pdl.finnEtterlatteForPerson(packet["@avdod_ident"].asText()).forEach {
                logger.info("Fant en etterlatt" + packet["@etterlatt_ident"].asText())
                context.publish(JsonMessage(packet.toJson(), MessageProblems("{}")).apply {
                    set("@etterlatt_ident", it)
                    set("@event_name", "etterlatt_barn_identifisert")
                }.toJson())
            }
        }
    }
}

interface FinnEtterlatteForPerson {
    suspend fun finnEtterlatteForPerson(forelder: String): List<String>
}
