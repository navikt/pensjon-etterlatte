package no.nav.etterlatte

import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.libs.common.pdl.Gradering.UGRADERT
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
            validate { it.requireKey("@skjema_info") }
            validate { it.requireKey("@fnr_soeker") }
            validate { it.rejectKey("@adressebeskyttelse") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {
        val identer = FnrHelper.finnAlleFnr(packet["@skjema_info"])

        logger.info("Fant ${identer.size} i søknaden")

        if (identer.isNotEmpty()) {
            runBlocking {
                val gradering = adressebeskyttelseService.hentGradering(identer)

                packet["@adressebeskyttelse"] = gradering.name
                logger.info("vurdert adressebeskyttelse til ${gradering.name}")
                context.publish(packet.toJson())
            }
        } else {
            packet["@adressebeskyttelse"] = UGRADERT
            logger.error("Ingen fødselsnummer funnet i dokumentet")
        }
    }

}
