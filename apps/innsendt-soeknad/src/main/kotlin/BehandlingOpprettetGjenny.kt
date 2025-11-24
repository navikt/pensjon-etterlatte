package no.nav.etterlatte

import com.github.navikt.tbd_libs.rapids_and_rivers.JsonMessage
import com.github.navikt.tbd_libs.rapids_and_rivers.River
import com.github.navikt.tbd_libs.rapids_and_rivers.isMissingOrNull
import com.github.navikt.tbd_libs.rapids_and_rivers_api.MessageContext
import com.github.navikt.tbd_libs.rapids_and_rivers_api.MessageMetadata
import com.github.navikt.tbd_libs.rapids_and_rivers_api.RapidsConnection
import io.micrometer.core.instrument.MeterRegistry
import org.slf4j.LoggerFactory
import soeknad.SoeknadRepository
import java.time.OffsetDateTime
import java.util.UUID

internal class BehandlingOpprettetGjenny(
    rapidsConnection: RapidsConnection,
    private val soeknader: SoeknadRepository,
) : River.PacketListener {
    private val logger = LoggerFactory.getLogger(BehandlingOpprettetGjenny::class.java)

    init {
        River(rapidsConnection)
            .apply {
                validate { it.demandValue("@event_name", EventName.TRENGER_BEHANDLING) }
                validate { it.requireKey("@lagret_soeknad_id") }
                validate { it.requireKey("sakId") }
                validate { it.requireKey("behandlingId") }
                validate { it.interestedIn("@hendelse_gyldig_til") }
            }.register(this)
    }

    override fun onPacket(
        packet: JsonMessage,
        context: MessageContext,
        metadata: MessageMetadata,
        meterRegistry: MeterRegistry,
    ) {
        val sakId = packet["sakId"].longValue()
        val behandlingId =
            packet["behandlingId"].textValue().let {
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
                    logger.info(
                        "${OffsetDateTime.now()}: Fikk melding om at søknad ${soeknadId.asLong()} har " +
                            "behandling, men hendelsen gikk ut på dato $it",
                    )
                }
            }
        }
    }
}