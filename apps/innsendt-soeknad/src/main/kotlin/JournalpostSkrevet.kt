package no.nav.etterlatte

import com.fasterxml.jackson.databind.JsonNode
import no.nav.etterlatte.libs.utils.kafka.EventName
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River
import no.nav.helse.rapids_rivers.isMissingOrNull
import org.slf4j.LoggerFactory
import soeknad.SoeknadRepository
import java.time.OffsetDateTime

internal class JournalpostSkrevet(
    rapidsConnection: RapidsConnection,
    private val soeknader: SoeknadRepository
) : River.PacketListener {

    private val logger = LoggerFactory.getLogger(JournalpostSkrevet::class.java)

    init {
        River(rapidsConnection).apply {
            validate { it.rejectValue("@event_name", EventName.TRENGER_BEHANDLING) }
            validate { it.requireKey("@dokarkivRetur") }
            validate { it.requireKey("@lagret_soeknad_id") }
            validate { it.interestedIn("@hendelse_gyldig_til") }
            validate { it.interestedIn("soeknadFordelt") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {
        val dokumentInfoId = dokarkivRetur(packet).path("dokumenter")[0]?.path("dokumentInfoId")?.asLong() ?: 0L

        if (erTestSoeknad(packet)) {
            logger.info("Verifiseringssøknad med id ${soeknadId(packet)} lest med dokumentInfoId $dokumentInfoId")
        }

        val soeknadSkalTilDoffen = packet["soeknadFordelt"].asBoolean()

        if (dokumentInfoId != 0L) {
            if (soeknadSkalTilDoffen) {
                setSoeknadTilDoffenArkivert(packet)

                packet["@event_name"] = EventName.TRENGER_BEHANDLING
                context.publish(packet.toJson())
            } else {
                setSoeknadTilArkivert(packet)
            }
        } else {
            logger.error("Arkivering feilet: {}", packet.toJson())
            setSoeknadTilFeiletArkivering(packet)
        }

        if (!packet["@hendelse_gyldig_til"].isMissingOrNull()) {
            OffsetDateTime.parse(packet["@hendelse_gyldig_til"].asText()).also {
                if (it.isBefore(OffsetDateTime.now())) {
                    logger.info("${OffsetDateTime.now()}: Fikk melding om at søknad ${soeknadIdAsLong(packet)} " +
                            "er arkivert, men hendelsen gikk ut på dato $it"
                    )
                }
            }
        }
    }

    private fun setSoeknadTilFeiletArkivering(packet: JsonMessage) {
        if (!erTestSoeknad(packet)) {
            soeknader.soeknadFeiletArkivering(soeknadIdAsLong(packet), dokarkivRetur(packet).toJson()
            )
        }
    }

    private fun setSoeknadTilArkivert(packet: JsonMessage) {
        if (!erTestSoeknad(packet)) {
            soeknader.soeknadArkivert(soeknadIdAsLong(packet), dokarkivRetur(packet).toJson())
        }
    }

    private fun setSoeknadTilDoffenArkivert(packet: JsonMessage) {
        if (!erTestSoeknad(packet)) {
            soeknader.soeknadTilDoffenArkivert(soeknadIdAsLong(packet), dokarkivRetur(packet).toJson())
        }
    }

    private fun soeknadIdAsLong(packet: JsonMessage): Long {
        return if (erTestSoeknad(packet)) 0L else soeknadId(packet).asLong()
    }

    private fun erTestSoeknad(packet: JsonMessage): Boolean {
        val soeknadId = soeknadId(packet)
        return soeknadId.toString().startsWith("TEST-") || soeknadId.asLong() == 0L
    }

    private fun soeknadId(packet: JsonMessage): JsonNode = packet["@lagret_soeknad_id"]

    private fun dokarkivRetur(packet: JsonMessage): JsonNode = packet["@dokarkivRetur"]
}