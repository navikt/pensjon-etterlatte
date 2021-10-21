package no.nav.etterlatte

import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.pdl.AdressebeskyttelseService
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River
import org.slf4j.LoggerFactory

internal class SjekkAdressebeskyttelse(
    rapidsConnection: RapidsConnection,
    private val adressebeskyttelseService: AdressebeskyttelseService
) : River.PacketListener {

    private val logger = LoggerFactory.getLogger(SjekkAdressebeskyttelse::class.java)

    init {
        River(rapidsConnection).apply {
            validate { it.requireKey("@fnr_soeker") }
            validate { it.requireKey("@lagret_soeknad_id") }
            validate { it.rejectKey("@adressebeskyttelse") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {
        val soeknadId = packet["@lagret_soeknad_id"].asText()
        val fnrSoeker = Foedselsnummer.of(packet["@fnr_soeker"].asText())

        logger.info("Sjekker adressebeskyttelse for søknad med ID: $soeknadId")

        runBlocking {
            val gradering = adressebeskyttelseService.hentGradering(fnrSoeker)

            packet["@adressebeskyttelse"] = gradering.name
            logger.info("vurdert adressebeskyttelse til ${gradering.name}")
            context.publish(packet.toJson())
        }
    }

}
