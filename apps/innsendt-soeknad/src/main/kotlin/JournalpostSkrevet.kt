package no.nav.etterlatte

import com.fasterxml.jackson.databind.node.BooleanNode
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import no.nav.helse.rapids_rivers.MessageProblems
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
            validate { it.rejectValue("@event_name", TRENGER_BEHANDLING_EVENT)}
            validate { it.requireKey("@dokarkivRetur") }
            validate { it.requireKey("@lagret_soeknad_id") }
            validate { it.interestedIn("@hendelse_gyldig_til") }
            validate { it.interestedIn("soeknadFordelt") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {
        val dokarkivRetur = packet["@dokarkivRetur"]
        val dokumentInfoId = dokarkivRetur.path("dokumenter")[0]?.path("dokumentInfoId")?.asLong() ?: 0L

        val soeknadId = packet["@lagret_soeknad_id"]
        if (soeknadId.toString().startsWith("TEST-") || soeknadId.asLong() == 0L) {
            logger.info("Verifiseringssøknad med id $soeknadId lest med dokumentInfoId $dokumentInfoId")
            return
        }

        val soeknadSkalTilDoffen = when (val fordelt = packet["soeknadFordelt"]) {
            is BooleanNode -> fordelt.booleanValue()
            else -> false
        }

        if (dokumentInfoId != 0L) {
            if (soeknadSkalTilDoffen) {
                soeknader.soeknadTilDoffenArkivert(soeknadId.asLong(), dokarkivRetur.toJson())
                packet["@event_name"] = TRENGER_BEHANDLING_EVENT
                context.publish(packet.toJson())
            } else {
                soeknader.soeknadArkivert(soeknadId.asLong(), dokarkivRetur.toJson())
            }
        } else {
            logger.error("Arkivering feilet: {}", packet.toJson())
            soeknader.soeknadFeiletArkivering(
                soeknadId.asLong(),
                packet["@dokarkivRetur"].toJson()
            )
        }

        if (!packet["@hendelse_gyldig_til"].isMissingOrNull()) {
            OffsetDateTime.parse(packet["@hendelse_gyldig_til"].asText()).also {
                if (it.isBefore(OffsetDateTime.now())) {
                    logger.info("${OffsetDateTime.now()}: Fikk melding om at søknad ${soeknadId.asLong()} er arkivert, men hendelsen gikk ut på dato $it")
                }
            }
        }
    }
}
