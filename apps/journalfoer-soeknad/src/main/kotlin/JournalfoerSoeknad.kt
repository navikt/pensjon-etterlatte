package no.nav.etterlatte

import com.fasterxml.jackson.databind.JsonNode
import kotlinx.coroutines.runBlocking
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River

internal class JournalfoerSoeknad(
    rapidsConnection: RapidsConnection,
    private val pdf: GenererPdf,
    private val dok: JournalfoerDok
) :
    River.PacketListener {

    init {
        River(rapidsConnection).apply {
            validate { it.demandValue("@event_name", "soeknad_innsendt") }
            validate { it.requireKey("@skjema_info") }
            validate { it.requireKey("@template") }
            validate { it.requireKey("@tittel") }
            validate { it.requireKey("@kanal") }
            validate { it.requireKey("@avsenderMottaker") }
            validate { it.requireKey("@sak") }
            validate { it.requireKey("@dokumenter") }
            validate { it.requireKey("@journalfoerendeEnhet") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {
        //println(packet["@etterlatt_ident"].asText())

        runBlocking {

            //må endre håndering av skjermainfo
            packet["@journalpostId"] = dok.journalfoerDok(packet, pdf.genererPdf(packet["@skjema_info"], packet["@template"].asText())
            )
            context.publish(packet.toJson())
        }
    }
}

interface GenererPdf {
    suspend fun genererPdf(input: JsonNode, template: String): ByteArray
}

interface JournalfoerDok {
    suspend fun journalfoerDok(dokumentInnhold: JsonMessage, pdf: ByteArray): String
}
