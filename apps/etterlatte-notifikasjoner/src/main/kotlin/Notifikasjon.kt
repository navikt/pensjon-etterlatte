package no.nav.etterlatte

import kotlinx.coroutines.runBlocking
import no.nav.brukernotifikasjon.schemas.Beskjed
import no.nav.brukernotifikasjon.schemas.builders.BeskjedBuilder
import no.nav.brukernotifikasjon.schemas.builders.domain.PreferertKanal
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.net.URL
import java.time.LocalDateTime
import java.time.ZoneOffset
import java.time.temporal.ChronoUnit


class Notifikasjon(private val sendNotifikasjon: SendNotifikasjon, rapidsConnection: RapidsConnection) :
    River.PacketListener {

    private val logger: Logger = LoggerFactory.getLogger("no.pensjon.etterlatte")
    private val notifikasjonsTekst = "Vi har mottatt søknaden din om gjenlevendepensjon"
    private val notifikasjonsUrl  = null
    private val grupperingsId = "ETTERLATTE"
    private val eksternVarsling = true
    private val prefererteKanaler = listOf("SMS", "EPOST")

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
            val dto = ProduceBeskjedDto(
                tekst = notifikasjonsTekst,
                link = notifikasjonsUrl,
                grupperingsid = grupperingsId,
                eksternVarsling = eksternVarsling,
                prefererteKanaler = prefererteKanaler
            )

            val notifikasjon = opprettNotifikasjonForIdent(packet["@fnr_soeker"].textValue(), dto)

            sendNotifikasjon.sendMessage(notifikasjon)
            packet["@notifikasjon"] = "Notifikasjon sendt til bruker"
            context.publish(packet.toJson())
            logger.info("Notifikasjon til bruker opprettet")
        }   
    }
}

private fun opprettNotifikasjonForIdent(fnr: String, dto: ProduceBeskjedDto): Beskjed {
    val now = LocalDateTime.now(ZoneOffset.UTC)
    val weekFromNow = now.plus(7, ChronoUnit.DAYS)
    val build = BeskjedBuilder()
        .withFodselsnummer(fnr)
        .withGrupperingsId(dto.grupperingsid)
        .withTekst(dto.tekst)
        .withTidspunkt(now)
        .withSynligFremTil(weekFromNow)
        .withSikkerhetsnivaa(4)
        .withEksternVarsling(true)
        .withPrefererteKanaler(PreferertKanal.SMS)
    if (!dto.link.isNullOrBlank()) {
        build.withLink(URL(dto.link))
    }
    return build.build()
}





