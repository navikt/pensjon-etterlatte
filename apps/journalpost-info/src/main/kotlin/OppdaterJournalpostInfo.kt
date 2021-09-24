package no.nav.etterlatte

import com.fasterxml.jackson.databind.JsonNode
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.libs.common.journalpost.AvsenderMottaker
import no.nav.etterlatte.libs.common.journalpost.Bruker
import no.nav.etterlatte.libs.common.journalpost.JournalpostInfo
import no.nav.etterlatte.libs.common.pdl.Gradering
import no.nav.etterlatte.libs.common.pdl.Gradering.FORTROLIG
import no.nav.etterlatte.libs.common.pdl.Gradering.STRENGT_FORTROLIG
import no.nav.etterlatte.libs.common.pdl.Gradering.STRENGT_FORTROLIG_UTLAND
import no.nav.etterlatte.libs.common.pdl.Gradering.UGRADERT
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import no.nav.helse.rapids_rivers.MessageProblems
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River
import org.slf4j.LoggerFactory
import kotlin.random.Random

object Enhet {
    const val VIKAFOSSEN = "2103"
}

internal class OppdaterJournalpostInfo(
    rapidsConnection: RapidsConnection
) : River.PacketListener {

    private val logger = LoggerFactory.getLogger(OppdaterJournalpostInfo::class.java)

    init {
        River(rapidsConnection).apply {
            validate { it.demandValue("@event_name", "soeknad_innsendt") }
            validate { it.requireKey("@adressebeskyttelse") }
            validate { it.requireKey("@fnr_soeker") }
            validate { it.rejectKey("@journalpostInfo") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {
        runBlocking {
            packet["@journalpostInfo"] = lagJournalpostInfo(packet)
            logger.info("Lagt til journalpostInfo")
            context.publish(packet.toJson())
        }
    }

    override fun onError(problems: MessageProblems, context: MessageContext) {
        logger.error("Feil oppsto ved oppdatering av journalpostinfo: ", problems)
    }

    private fun lagJournalpostInfo(packet: JsonMessage): JournalpostInfo {
        return JournalpostInfo(
            tittel = "Søknad om etterlatteytelser",
            avsenderMottaker = AvsenderMottaker(id = packet["@fnr_soeker"].asText(), idType = "FNR", navn = ""),
            bruker = Bruker(id = packet["@fnr_soeker"].asText(), idType = "FNR"),
            journalfoerendeEnhet = finnEnhet(packet["@adressebeskyttelse"])
        )
    }

    private fun finnEnhet(adressebeskyttelse: JsonNode): String? =
        when (Gradering.fra(adressebeskyttelse.textValue())) {
            STRENGT_FORTROLIG_UTLAND,
            STRENGT_FORTROLIG -> Enhet.VIKAFOSSEN
            FORTROLIG,
            UGRADERT -> null
        }
}
