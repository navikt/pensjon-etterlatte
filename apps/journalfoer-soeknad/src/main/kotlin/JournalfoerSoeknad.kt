package no.nav.etterlatte

import com.fasterxml.jackson.databind.JsonNode
import io.ktor.client.features.ClientRequestException
import kotlinx.coroutines.Dispatchers
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
            validate { it.requireKey("@journalpostInfo") }
            validate { it.requireKey("@lagret_soeknad_id") }
            validate { it.rejectKey("@dokarkivRetur") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {
        try {
            runBlocking(Dispatchers.IO) {
                packet["@dokarkivRetur"] = dok.journalfoerDok(
                    packet, pdf.genererPdf(packet["@skjema_info"], packet["@template"].asText())
                )
                println("Journalført en ny PDF med journalpostId: " + packet["@dokarkivRetur"])
                context.publish(packet.toJson())
            }
        }catch (err: ClientRequestException){
            println("duplikat: $err")
            println(packet["@dokarkivRetur"])
        } catch (err: Exception) {
            println("Fillern, dette klarte jeg ikke: $err")

        }
    }
}

interface GenererPdf {
    suspend fun genererPdf(input: JsonNode, template: String): ByteArray
}

interface JournalfoerDok {
    suspend fun journalfoerDok(dokumentInnhold: JsonMessage, pdf: ByteArray): JsonNode
}
