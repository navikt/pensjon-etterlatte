package no.nav.etterlatte

import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River
import no.nav.helse.rapids_rivers.isMissingOrNull
import java.time.OffsetDateTime

internal class JournalpostSkrevet(rapidsConnection: RapidsConnection, private val soeknader: SoeknadRepository) :
    River.PacketListener {

    init {
        River(rapidsConnection).apply {
            validate { it.requireKey("@journalpostId") }
            validate { it.requireKey("@lagret_soeknad_id") }
            validate { it.interestedIn("@hendelse_gyldig_til") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {
        soeknader.soeknadJournalfoert(LagretSoeknad("", "", packet["@lagret_soeknad_id"].asLong()))
        if(!packet["@hendelse_gyldig_til"].isMissingOrNull()){
            OffsetDateTime.parse(packet["@hendelse_gyldig_til"].asText()).also {
                if(it.isAfter(OffsetDateTime.now())){
                    println{"${OffsetDateTime.now()}: Fikk melding om at søknad ${packet["@lagret_soeknad_id"].asLong()} er arkivert, men hendelsen gikk ut på dato $it"}
                }
            }
        }
    }
}