package no.nav.etterlatte

import kotlinx.coroutines.runBlocking
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River
import java.time.LocalDate
import java.time.Period


internal class SjekkAlderEtterlatte(rapidsConnection: RapidsConnection, private val pdl: SjekkAlderForEtterlatte) :
    River.PacketListener {

    init {
        River(rapidsConnection).apply {
            validate { it.demandValue("@event_name", "etterlatt_barn_identifisert") }
            validate { it.requireKey("@etterlatt_ident", "@avdod_doedsdato") }
            validate { it.forbid("@alder_ved_dodsfall") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {
        println(packet["@etterlatt_ident"].asText())

        runBlocking {
            packet["@alder_ved_dodsfall"] = Period.between(
                pdl.sjekkAlderForEtterlatte(packet["@etterlatt_ident"].asText()),
                LocalDate.parse(packet["@avdod_doedsdato"].textValue())
            ).years
            context.publish(packet.toJson())
        }
    }
}

interface SjekkAlderForEtterlatte {
    suspend fun sjekkAlderForEtterlatte(etterlatt: String): LocalDate
}
