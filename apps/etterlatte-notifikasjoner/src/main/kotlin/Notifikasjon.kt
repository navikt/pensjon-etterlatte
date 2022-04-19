package no.nav.etterlatte

import com.fasterxml.jackson.module.kotlin.readValue
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.InnsendtSoeknad
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River
import org.slf4j.Logger
import org.slf4j.LoggerFactory


class Notifikasjon(private val sendNotifikasjon: SendNotifikasjon, rapidsConnection: RapidsConnection) :
    River.PacketListener {

    private val logger: Logger = LoggerFactory.getLogger(Notifikasjon::class.java)

    private val rapid = rapidsConnection

    init {
        River(rapidsConnection).apply {
            validate { it.demandValue("@event_name", "soeknad_innsendt") }
            validate { it.requireKey("@dokarkivRetur") }
            validate { it.requireKey("@fnr_soeker") }
            validate { it.requireKey("@skjema_info") }
            validate { it.requireKey("@lagret_soeknad_id") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {
        runBlocking {
            val soeknad: InnsendtSoeknad = mapper.readValue(packet["@skjema_info"].asText())

            sendNotifikasjon.sendMessage(soeknad)

            val journalpostId = packet["@dokarkivRetur"]["journalpostId"]
            JsonMessage.newMessage(
                mapOf(
                    "@event_name" to "notifikasjon_sendt",
                    "@lagret_soeknad_id" to packet["@lagret_soeknad_id"],
                    "@journalpostId" to journalpostId,
                    "@notifikasjon" to "Notifikasjon sendt",
                )
            ).apply {
                try {
                    rapid.publish("SendNotifikasjon " + journalpostId.textValue(), toJson())
                } catch (err: Exception) {
                    logger.error("Uhaandtert feilsituasjon. Ingen notifikasjon opprettet: ", err)
                }

            }
            logger.info("Notifikasjon til bruker opprettet")
        }
    }
}
