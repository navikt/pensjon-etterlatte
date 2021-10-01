package no.nav.etterlatte

import com.fasterxml.jackson.databind.JsonNode
import kotlinx.coroutines.runBlocking
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River
import org.slf4j.LoggerFactory


internal class FinnFnrSoeknad(
    rapidsConnection: RapidsConnection
) : River.PacketListener {

    private val logger = LoggerFactory.getLogger(FinnFnrSoeknad::class.java)

    init {
        River(rapidsConnection).apply {
            validate { it.requireKey("@skjema_info") }
            validate { it.requireKey("@fnr_soeker") }
            validate { it.rejectKey("@fnr_liste") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) = runBlocking {
        val brukere = finnFnrForSkjema(packet["@skjema_info"])
        logger.info("Fant følgende brukere: $brukere")
        packet["@fnr_liste"] = brukere + packet["@fnr_soeker"].textValue()
        context.publish(packet.toJson())
    }

    private fun finnFnrForSkjema(skjemainfo: JsonNode): List<String> {
        val regex = """\b(\d{11})\b""".toRegex()

        return regex.findAll(skjemainfo.toString())
            .filter { FoedselsnummerValidator.isValid(it.value) }
            .map { it.groupValues[1] }
            .toList()
            .distinct()
    }
}
