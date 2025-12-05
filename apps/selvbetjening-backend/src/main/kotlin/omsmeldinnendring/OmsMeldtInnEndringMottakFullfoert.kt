package no.nav.etterlatte.omsendringer

import com.github.navikt.tbd_libs.rapids_and_rivers.JsonMessage
import com.github.navikt.tbd_libs.rapids_and_rivers.River
import com.github.navikt.tbd_libs.rapids_and_rivers_api.MessageContext
import com.github.navikt.tbd_libs.rapids_and_rivers_api.MessageMetadata
import com.github.navikt.tbd_libs.rapids_and_rivers_api.RapidsConnection
import io.micrometer.core.instrument.MeterRegistry
import no.nav.etterlatte.libs.common.omsmeldinnendring.OmsMeldtInnEndringStatus
import org.slf4j.LoggerFactory
import java.util.UUID

internal class OmsMeldtInnEndringMottakFullfoert(
    rapidsConnection: RapidsConnection,
    private val service: OmsMeldInnEndringService,
) : River.PacketListener {
    private val logger = LoggerFactory.getLogger(OmsMeldtInnEndringMottakFullfoert::class.java)

    init {
        River(rapidsConnection)
            .apply {
                precondition {
                    it.requireValue(
                        "@event_name",
                        MOTTAK_FULLFOERT_EVENT,
                    )
                }
                validate { it.requireKey(OMS_MELDT_INN_ENDRING_ID) }
            }.register(this)
    }

    override fun onPacket(
        packet: JsonMessage,
        context: MessageContext,
        metadata: MessageMetadata,
        meterRegistry: MeterRegistry,
    ) {
        val id =
            packet[OMS_MELDT_INN_ENDRING_ID].textValue().let {
                UUID.fromString(it)
            }

        logger.info("Meldt inn endring for omstillingstønad er mottatt i Gjenny id=$id")
        service.oppdaterStatusForId(id, OmsMeldtInnEndringStatus.FERDIGSTILT)
        logger.info("Meldt inn endring for omstillingstønad er satt til publistert for id=$id")
    }

    companion object {
        const val MOTTAK_FULLFOERT_EVENT = "oms_meldt_inn_endring_mottak_fullført"
        const val OMS_MELDT_INN_ENDRING_ID = "meldt_inn_endring_id"
    }
}