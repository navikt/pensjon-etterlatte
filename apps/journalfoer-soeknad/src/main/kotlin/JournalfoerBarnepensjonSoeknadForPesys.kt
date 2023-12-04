package no.nav.etterlatte

import com.fasterxml.jackson.module.kotlin.readValue
import io.ktor.client.plugins.ResponseException
import no.nav.etterlatte.dokarkiv.DokarkivResponse
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.InnsendtSoeknad
import no.nav.etterlatte.libs.common.pdl.Gradering
import no.nav.etterlatte.pdf.DokumentService
import no.nav.etterlatte.pdf.PdfGeneratorException
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River
import org.slf4j.LoggerFactory
import java.time.Clock
import java.time.OffsetDateTime

/**
 * TODO: Denne riveren kan skrotes når fordeleren er ute av verden og vi ikke lenger skal sende bp til pesys
 **/
internal class JournalfoerBarnepensjonSoeknadForPesys(
    rapidsConnection: RapidsConnection,
    private val dokumentService: DokumentService,
    private val journalfoeringService: JournalfoeringService,
    private val klokke: Clock = Clock.systemUTC()
) : River.PacketListener {
    private val logger = LoggerFactory.getLogger(JournalfoerBarnepensjonSoeknadForPesys::class.java)

    init {
        River(rapidsConnection).apply {
            validate { it.demandValue("@event_name", "soeknad_innsendt") }
            validate { it.requireKey("@skjema_info") }
            validate { it.requireKey("@template") }
            validate { it.requireKey("@adressebeskyttelse") }
            validate { it.requireKey("@fnr_soeker") }
            validate { it.requireKey("@lagret_soeknad_id") }
            validate { it.requireKey("@hendelse_gyldig_til") }
            validate { it.requireValue("soeknadFordelt", false) }
            validate { it.rejectKey("@dokarkivRetur") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {
        val soeknadId = packet["@lagret_soeknad_id"].asText()
        val gyldigTilDato = OffsetDateTime.parse(packet["@hendelse_gyldig_til"].asText())

        if (gyldigTilDato.isBefore(OffsetDateTime.now(klokke))) {
            logger.error("Avbrutt journalføring for søknad (id=$soeknadId) da hendelsen ikke er gyldig lengre")
            return
        }

        try {
            val dokarkivResponse = journalfoer(soeknadId, packet)

            packet["@dokarkivRetur"] = dokarkivResponse

            context.publish(packet.toJson())
        } catch (pdf: PdfGeneratorException) {
            logger.error(pdf.message, pdf.cause)
        } catch (re: ResponseException) {
            logger.error("Feil under journalføring av søknad (id=$soeknadId)", re)
        } catch (e: Exception) {
            logger.error("Ukjent feil oppsto under journalføring av søknad (id=$soeknadId): ", e)
        }
    }

    private fun journalfoer(soeknadId: String, packet: JsonMessage): DokarkivResponse {
        val fnrSoeker = packet["@fnr_soeker"].asText()
        val gradering = Gradering.fra(packet["@adressebeskyttelse"].textValue())
        val skjemaInfo = packet["@skjema_info"]
        val soeknad: InnsendtSoeknad = mapper.readValue(skjemaInfo.toString())

        val dokument = dokumentService.opprettJournalpostDokument(soeknadId, skjemaInfo, soeknad.template())

        return journalfoeringService.journalfoer(
            soeknadId = soeknadId,
            fnrSoeker = fnrSoeker,
            gradering = gradering,
            dokument = dokument,
            soeknad = soeknad,
            tema = "PEN",
            behandlingstema = soeknad.type.behandlingstema,
            forsoekFerdigstill = false,
            sakId = null
        )
    }
}
