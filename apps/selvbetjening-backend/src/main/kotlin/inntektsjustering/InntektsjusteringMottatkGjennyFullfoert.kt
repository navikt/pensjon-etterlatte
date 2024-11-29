package no.nav.etterlatte.inntektsjustering

import no.nav.etterlatte.jobs.PubliserInntektsjusteringStatus
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River
import org.slf4j.LoggerFactory
import java.util.UUID

internal class InntektsjusteringMottatkGjennyFullfoert(
    rapidsConnection: RapidsConnection,
    private val service: InntektsjusteringService,
) : River.PacketListener {
    private val logger = LoggerFactory.getLogger(InntektsjusteringMottatkGjennyFullfoert::class.java)

    init {
        River(rapidsConnection)
            .apply {
                validate { it.demandValue("@event_name", INNTEKTJUSTERING_MOTTAK_FULLFOERT) }
                validate { it.requireKey(INNTEKTSJUSTERING_ID) }
            }.register(this)
    }

    override fun onPacket(
        packet: JsonMessage,
        context: MessageContext,
    ) {
        val id =
            packet[INNTEKTSJUSTERING_ID].textValue().let {
                UUID.fromString(it)
            }
        logger.info("Inntektsjustering mottak fullført i Gjenny id=$id")
        service.oppdaterStatusForId(id, PubliserInntektsjusteringStatus.PUBLISERT)
        logger.info("Inntektsjustering satt til publisert =$id")
    }

    companion object {
        const val INNTEKTJUSTERING_MOTTAK_FULLFOERT = "INNTEKTSJUSTERING:MOTTAK_FULLFOERT"
        const val INNTEKTSJUSTERING_ID = "inntektsjustering_id"
    }
}