package no.nav.etterlatte

import com.fasterxml.jackson.databind.JsonNode
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.libs.common.adressebeskyttelse.Adressebeskyttelse.INGENBESKYTTELSE
import no.nav.etterlatte.libs.common.adressebeskyttelse.Adressebeskyttelse.KODE19
import no.nav.etterlatte.libs.common.adressebeskyttelse.Adressebeskyttelse.KODE6
import no.nav.etterlatte.libs.common.adressebeskyttelse.Adressebeskyttelse.KODE7
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

    private fun lagJournalpostInfo(packet: JsonMessage): JournalpostInfo {

        return JournalpostInfo(
            tittel = "Søknad om etterlatteytelser",
            avsenderMottaker = AvsenderMottaker(id = packet["@fnr_soeker"].asText(), idType = "FNR", navn = ""),
            bruker = Bruker(id = packet["@fnr_soeker"].asText(), idType = "FNR"),
            journalfoerendeEnhet = finnEnhet(packet["@adressebeskyttelse"])
        )
    }

    private fun finnEnhet(adressebeskyttelse: JsonNode): String {

        return when (adressebeskyttelse.textValue()){
            KODE6 -> "2103"
            KODE19 -> "2103"
            KODE7 -> "4817"
            INGENBESKYTTELSE -> "4817"
            else -> "4817"
        }
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


