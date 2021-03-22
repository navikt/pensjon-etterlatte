package no.nav.etterlatte

import kotlinx.coroutines.runBlocking
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River


internal class JournalfoerSoeknad(rapidsConnection: RapidsConnection, private val pdl: GenererPdf) :
    River.PacketListener {

    init {
        River(rapidsConnection).apply {
            validate { it.demandValue("@event_name", "soeknad_innsendt") }
            //((validate { it.requireKey("@etterlatt_ident", "@avdod_doedsdato") }
            //validate { it.forbid("@alder_ved_dodsfall") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: RapidsConnection.MessageContext) {
        //println(packet["@etterlatt_ident"].asText())

        runBlocking {

            //TODO generere PDF og journalføre

           // packet["@alder_ved_dodsfall"] = Period.between(
               // pdl.sjekkAlderForEtterlatte(packet["@etterlatt_ident"].asText()),
               // LocalDate.parse(packet["@avdod_doedsdato"].textValue())
          //  ).years
            context.send(packet.toJson())
        }
    }
}

interface GenererPdf {
    suspend fun genererPdf(input: String, template: String) : ByteArray
}
interface JournalfoerDok {
    suspend fun journalfoerDok(metadata: String, pdf: ByteArray) : String
}
