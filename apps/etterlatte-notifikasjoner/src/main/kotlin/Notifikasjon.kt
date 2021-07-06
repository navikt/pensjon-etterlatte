package no.nav.etterlatte

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.treeToValue
import kotlinx.coroutines.runBlocking
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River
import java.util.*


internal class Notifikasjon(rapidsConnection: RapidsConnection) :

    River.PacketListener {

    init {
        River(rapidsConnection).apply {
            validate { it.demandValue("@event_name", "soeknad_innsendt") }
            validate { it.requireKey("@dokarkivRetur") }
            validate { it.requireKey("@fnr_soeker") }
            validate { it.rejectKey("@notifikasjon") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {


        runBlocking {
            packet["@notifikasjon"] = opprettNotifikasjon(packet["@fnr_soeker"].textValue())
            context.publish(packet.toJson())
            }
    }
    private fun opprettNotifikasjon(fnr: String) : JsonNode
    {
        //TODO
        val objectMapper = jacksonObjectMapper()
            .registerModule(JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
            .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)

      /*  val notifikasjon: Beskjed? = objectMapper.treeToValue(dokumentInnhold["@journalpostInfo"])
        val lagretSoeknadId = dokumentInnhold["@lagret_soeknad_id"]
        val journalpostrequest = journalpostInfo?.let {

            JournalpostRequest(
                tittel = journalpostInfo.tittel + lagretSoeknadId,
                journalpostType = JournalPostType.INNGAAENDE,
                journalfoerendeEnhet = journalpostInfo.journalfoerendeEnhet,
                tema = "PEN",
                eksternReferanseId = journalpostInfo.tittel + lagretSoeknadId,
                kanal = "NAV_NO",
                behandlingstema = "ab0255",
                avsenderMottaker = AvsenderMottaker(
                    id = journalpostInfo.avsenderMottaker.id,
                    navn = journalpostInfo.avsenderMottaker.navn,
                    idType = journalpostInfo.avsenderMottaker.idType
                ),
                bruker = Bruker(
                    id = journalpostInfo.bruker.id,
                    idType = journalpostInfo.bruker.idType
                ),
                dokumenter = listOf(
                    JournalpostDokument(
                        tittel = journalpostInfo.tittel,
                        dokumentKategori = DokumentKategori.SOK,
                        dokumentvarianter = listOf(
                            DokumentVariant.ArkivPDF(fysiskDokument = Base64.getEncoder().encodeToString(pdf)),
                            DokumentVariant.OriginalJson(
                                fysiskDokument = Base64.getEncoder().encodeToString(
                                    objectMapper.writeValueAsString(dokumentInnhold["@skjema_info"]).toByteArray()
                                )
                            )
                        )
                    )
                )
            )
        }

    }
    */
}



