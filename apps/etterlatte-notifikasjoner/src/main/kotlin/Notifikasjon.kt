package no.nav.etterlatte

import kotlinx.coroutines.runBlocking
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River
import org.slf4j.Logger
import org.slf4j.LoggerFactory


class Notifikasjon(private val sendNotifikasjon: SendNotifikasjon, rapidsConnection: RapidsConnection) :
    River.PacketListener {

    private val logger: Logger = LoggerFactory.getLogger("no.pensjon.etterlatte")

    init {
        sendNotifikasjon.startuptask()
        River(rapidsConnection).apply {
            validate { it.demandValue("@event_name", "soeknad_innsendt") }
            validate { it.requireKey("@dokarkivRetur") }
            validate { it.requireKey("@fnr_soeker") }
            validate { it.rejectKey("@notifikasjon") }
        }.register(this)

    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {

        runBlocking {

            sendNotifikasjon.sendMessage(packet["@fnr_soeker"].textValue())
            packet["@notifikasjon"] = "Notifikasjon sendt til bruker"
            context.publish(packet.toJson())
            logger.info("Notifikasjon til bruker opprettet")
        }
    }
}





