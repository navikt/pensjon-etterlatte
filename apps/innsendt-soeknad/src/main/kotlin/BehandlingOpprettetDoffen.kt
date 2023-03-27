package no.nav.etterlatte

import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River
import no.nav.helse.rapids_rivers.isMissingOrNull
import org.slf4j.LoggerFactory
import soeknad.SoeknadRepository
import java.time.OffsetDateTime
import java.util.UUID

internal class BehandlingOpprettetDoffen(
    rapidsConnection: RapidsConnection,
    private val soeknader: SoeknadRepository
) : River.PacketListener {

    private val logger = LoggerFactory.getLogger(BehandlingOpprettetDoffen::class.java)

    init {
        River(rapidsConnection).apply {
            validate { it.demandValue("@event_name", TRENGER_BEHANDLING_EVENT) }
            validate { it.requireKey("@lagret_soeknad_id") }
            validate { it.requireKey("sakId") }
            validate { it.requireKey("behandlingId") }
            validate { it.interestedIn("@hendelse_gyldig_til") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {
        val sakId = packet["sakId"].longValue()
        val behandlingId = packet["behandlingId"].textValue().let {
            UUID.fromString(it)
        }

        val soeknadId = packet["@lagret_soeknad_id"]
        if (soeknadId.toString().startsWith("TEST-") || soeknadId.asLong() == 0L) {
            logger.info("Verifiseringssøknad med id $soeknadId lest")
            return
        }
        soeknader.soeknadHarBehandling(soeknadId.asLong(), sakId, behandlingId)

        if (!packet["@hendelse_gyldig_til"].isMissingOrNull()) {
            OffsetDateTime.parse(packet["@hendelse_gyldig_til"].asText()).also {
                if (it.isBefore(OffsetDateTime.now())) {
                    logger.info("${OffsetDateTime.now()}: Fikk melding om at søknad ${soeknadId.asLong()} har " +
                            "behandling, men hendelsen gikk ut på dato $it")
                }
            }
        }
    }
}

