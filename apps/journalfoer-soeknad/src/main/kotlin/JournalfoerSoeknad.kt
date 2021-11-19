package no.nav.etterlatte

import com.fasterxml.jackson.databind.JsonNode
import io.ktor.client.features.ResponseException
import no.nav.etterlatte.libs.common.pdl.Gradering
import no.nav.etterlatte.libs.common.soeknad.SoeknadType
import no.nav.etterlatte.pdf.DokumentService
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import no.nav.helse.rapids_rivers.MessageProblems
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River
import org.slf4j.LoggerFactory
import java.time.Clock
import java.time.OffsetDateTime

internal class JournalfoerSoeknad(
    rapidsConnection: RapidsConnection,
    private val dokumentService: DokumentService,
    private val journalfoeringService: JournalfoeringService,
    private val klokke: Clock = Clock.systemUTC()
) : River.PacketListener {
    private val logger = LoggerFactory.getLogger(JournalfoerSoeknad::class.java)

    init {
        River(rapidsConnection).apply {
            validate { it.demandValue("@event_name", "soeknad_innsendt") }
            validate { it.requireKey("@skjema_info") }
            validate { it.requireKey("@template") }
            validate { it.requireKey("@adressebeskyttelse") }
            validate { it.requireKey("@fnr_soeker") }
            validate { it.requireKey("@lagret_soeknad_id") }
            validate { it.requireKey("@hendelse_gyldig_til") }
            validate { it.rejectKey("@dokarkivRetur") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {
        val gyldigTilDato = OffsetDateTime.parse(packet["@hendelse_gyldig_til"].asText())

        if (gyldigTilDato.isBefore(OffsetDateTime.now(klokke))) {
            logger.error("Avbrutt journalføring for søknad id ${packet["@lagret_soeknad_id"].asText()} da hendelsen ikke er gyldig lengre")
            return
        }

        try {
            val dokarkivResponse = journalfoer(packet)

            packet["@dokarkivRetur"] = dokarkivResponse

            context.publish(packet.toJson())
        } catch (err: ResponseException) {
            logger.error("duplikat: ", err)
            logger.error(packet["@dokarkivRetur"].asText())
        } catch (err: Exception) {
            logger.error("Uhaandtert feilsituasjon: ", err)
        }
    }

    override fun onError(problems: MessageProblems, context: MessageContext) {
        logger.error("Feil oppsto ved journalføring av søknad: ", problems)
    }

    private fun journalfoer(packet: JsonMessage): JsonNode {
        val soeknadId = packet["@lagret_soeknad_id"].asText()
        val fnrSoeker = packet["@fnr_soeker"].asText()
        val gradering = Gradering.fra(packet["@adressebeskyttelse"].textValue())
        val template = packet["@template"].asText()
        val skjemaInfo = packet["@skjema_info"]
        val soeknadType = SoeknadType.valueOf(skjemaInfo.get("soeknadsType").asText())

        val dokument = dokumentService.opprettJournalpostDokument(soeknadId, skjemaInfo, template)

        return journalfoeringService.journalfoer(soeknadId, fnrSoeker, gradering, dokument, soeknadType)
    }
}
