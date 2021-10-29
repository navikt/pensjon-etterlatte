package no.nav.etterlatte

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.module.kotlin.treeToValue
import io.ktor.client.features.ResponseException
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.libs.common.journalpost.JournalpostInfo
import no.nav.etterlatte.libs.common.objectMapper
import no.nav.etterlatte.libs.common.soeknad.SoeknadType
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River
import org.slf4j.LoggerFactory
import java.time.Clock
import java.time.OffsetDateTime

internal class JournalfoerSoeknad(
    rapidsConnection: RapidsConnection,
    private val pdf: GenererPdf,
    private val journalfoeringService: JournalfoeringService,
    private val klokke: Clock = Clock.systemUTC()
) : River.PacketListener {
    private val logger = LoggerFactory.getLogger(JournalfoerSoeknad::class.java)

    init {
        River(rapidsConnection).apply {
            validate { it.demandValue("@event_name", "soeknad_innsendt") }
            validate { it.requireKey("@skjema_info") }
            validate { it.requireKey("@template") }
            validate { it.requireKey("@journalpostInfo") }
            validate { it.requireKey("@lagret_soeknad_id") }
            validate { it.requireKey("@hendelse_gyldig_til") }
            validate { it.rejectKey("@dokarkivRetur") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {
        val gyldigTilDato = OffsetDateTime.parse(packet["@hendelse_gyldig_til"].asText())

        if (gyldigTilDato.isBefore(OffsetDateTime.now(klokke))) {
            logger.error("Avbrutt journalføring da hendelsen ikke er gyldig lengre")
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

    private fun journalfoer(packet: JsonMessage): JsonNode {
        val soknadId = packet["@lagret_soeknad_id"].asText()
        val journalpostInfo = objectMapper.treeToValue<JournalpostInfo>(packet["@journalpostInfo"])!!
        val skjemaInfo = objectMapper.writeValueAsBytes(packet["@skjema_info"])
        val soeknadType = SoeknadType.valueOf(packet["@skjema_info"].get("soeknadsType").asText())
        val pdf = runBlocking(Dispatchers.IO) {
            pdf.genererPdf(packet["@skjema_info"], packet["@template"].asText())
        }

        return journalfoeringService.journalfoer(soknadId, journalpostInfo, skjemaInfo, soeknadType, pdf)
    }
}
