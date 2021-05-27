package no.nav.etterlatte

import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River

internal class JournalpostSkrevet(rapidsConnection: RapidsConnection, private val soeknader: SoeknadRepository) :
    River.PacketListener {

    init {
        River(rapidsConnection).apply {
            validate { it.requireKey("@journalpostId") }
            validate { it.requireKey("@lagret_soeknad_id") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {
        soeknader.soeknadJournalfoert(LagretSoeknad("", "", packet["@lagret_soeknad_id"].asLong()))
    }
}