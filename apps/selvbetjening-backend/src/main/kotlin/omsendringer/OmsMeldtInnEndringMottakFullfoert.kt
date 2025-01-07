package no.nav.etterlatte.omsendringer

import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River
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
                validate {
                    it.demandValue(
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
        const val MOTTAK_FULLFOERT_EVENT = "OMS_MELDT_INN_ENDRING:MOTTAK_FULLFOERT"
        const val OMS_MELDT_INN_ENDRING_ID = "inntektsjustering_id"
    }
}