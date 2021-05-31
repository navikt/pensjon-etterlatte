package no.nav.etterlatte

import com.fasterxml.jackson.databind.JsonNode
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.libs.common.journalpost.AvsenderMottaker
import no.nav.etterlatte.libs.common.journalpost.Bruker
import no.nav.etterlatte.libs.common.journalpost.JournalpostInfo
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import no.nav.helse.rapids_rivers.MessageProblems
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River


internal class OppdaterJournalpostInfo(rapidsConnection: RapidsConnection) :
    River.PacketListener {

    init {
        River(rapidsConnection).apply {
            validate { it.demandValue("@event_name", "soeknad_innsendt") }
            //validate { it.requireKey("@skjema_info") }
            validate { it.requireKey("@adressebeskyttelse") }
            validate { it.requireKey("@fnr_soeker") }
            validate { it.rejectKey("@journalpostInfo") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {


        runBlocking {
            packet["@journalpostInfo"] = lagJournalpostInfo(packet)
            context.publish(packet.toJson())
            }
    }

    private fun lagJournalpostInfo(packet: JsonMessage ): JournalpostInfo {

        val journalpostInfo = JournalpostInfo (
            tittel = "Søknad om etterlatteytelser",
            avsenderMottaker = AvsenderMottaker(id = packet["@fnr_soeker"].asText(), idType = "FNR", navn = ""),
            bruker = Bruker(id = packet["@fnr_soeker"].asText(), idType = "FNR"),
            journalfoerendeEnhet = finnEnhet(packet["@adressebeskyttelse"])
        )
        return journalpostInfo
    }

    private fun finnEnhet(adressebeskyttelse: JsonNode): String {
        val KODE6 = "STRENGT_FORTROLIG"
        val KODE7 = "FORTROLIG"
        val KODE19 = "STRENGT_FORTROLIG_UTLAND"
        val INGENBESKYTTELSE = "INGEN_BESKYTTELSE"
        var resultat: String

        when (adressebeskyttelse.textValue()) {
            KODE6, KODE19 -> resultat = "2103"
            KODE7, INGENBESKYTTELSE -> resultat = "4817"
            else -> resultat = "4817"
        }
        return resultat
    }

}

internal class Monitor(rapidsConnection: RapidsConnection) : River.PacketListener {

    init {
        River(rapidsConnection).apply {
            validate { it.demandValue("@event_name", "fnr_liste_laget") }
        }.register(this)
    }

    override fun onError(problems: MessageProblems, context: MessageContext) {
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {
        println(packet.toJson())
    }
}


