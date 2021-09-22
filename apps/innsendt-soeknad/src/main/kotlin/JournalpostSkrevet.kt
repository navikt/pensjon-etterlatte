package no.nav.etterlatte

import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River
import no.nav.helse.rapids_rivers.isMissingOrNull
import org.slf4j.LoggerFactory
import java.time.OffsetDateTime

internal class JournalpostSkrevet(
    rapidsConnection: RapidsConnection,
    private val soeknader: SoeknadRepository
) : River.PacketListener {

    private val logger = LoggerFactory.getLogger(JournalpostSkrevet::class.java)

    init {
        River(rapidsConnection).apply {
            validate { it.requireKey("@dokarkivRetur") }
            validate { it.requireKey("@lagret_soeknad_id") }
            validate { it.interestedIn("@hendelse_gyldig_til") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {
        if(packet["@dokarkivRetur"].path("dokumenter")[0]?.path("dokumentInfoId")?.asLong()?:0L != 0L){
            soeknader.soeknadArkivert(LagretSoeknad("", "", packet["@lagret_soeknad_id"].asLong()))
        } else {
            logger.error("Arkivering feilet: ", packet.toJson())
            soeknader.soeknadFeiletArkivering(LagretSoeknad("", "", packet["@lagret_soeknad_id"].asLong()), packet["@dokarkivRetur"].toJson())
        }

        if(!packet["@hendelse_gyldig_til"].isMissingOrNull()){
            OffsetDateTime.parse(packet["@hendelse_gyldig_til"].asText()).also {
                if(it.isBefore(OffsetDateTime.now())){
                    logger.info("${OffsetDateTime.now()}: Fikk melding om at søknad ${packet["@lagret_soeknad_id"].asLong()} er arkivert, men hendelsen gikk ut på dato $it")
                }
            }
        }
    }
}