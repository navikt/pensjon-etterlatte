package no.nav.etterlatte

import com.fasterxml.jackson.databind.JsonNode
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.libs.common.journalpost.DokumentKategori
import no.nav.etterlatte.libs.common.journalpost.DokumentVariant
import no.nav.etterlatte.libs.common.journalpost.JournalPostType
import no.nav.etterlatte.libs.common.journalpost.JournalpostDokument
import no.nav.etterlatte.libs.common.journalpost.JournalpostInfo
import no.nav.etterlatte.libs.common.journalpost.JournalpostRequest
import org.slf4j.LoggerFactory
import java.util.Base64

class JournalfoeringService(private val klient: Dokarkiv) {

    private companion object {
        private const val behandlingstema = "ab0011" // ab0011 = gjenlevendepensjon
        private const val kanal = "NAV_NO"
        private const val tema = "PEN"
    }

    private val logger = LoggerFactory.getLogger(JournalfoeringService::class.java)

    private val encoder = Base64.getEncoder()

    fun journalfoer(
        soeknadId: String,
        journalpostInfo: JournalpostInfo,
        skjemaInfo: ByteArray,
        pdf: ByteArray
    ): JsonNode {
        logger.info("Oppretter journalpost for søknad ID $soeknadId")

        val dokument = JournalpostDokument(
            tittel = journalpostInfo.tittel,
            dokumentKategori = DokumentKategori.SOK,
            dokumentvarianter = listOf(
                DokumentVariant.ArkivPDF(encoder.encodeToString(pdf)),
                DokumentVariant.OriginalJson(encoder.encodeToString(skjemaInfo))
            )
        )

        val request = JournalpostRequest(
            tittel = journalpostInfo.tittel,
            journalpostType = JournalPostType.INNGAAENDE,
            tema = tema,
            kanal = kanal,
            behandlingstema = behandlingstema,
            journalfoerendeEnhet = journalpostInfo.journalfoerendeEnhet,
            avsenderMottaker = journalpostInfo.avsenderMottaker,
            bruker = journalpostInfo.bruker,
            eksternReferanseId = journalpostInfo.tittel + soeknadId,
            dokumenter = listOf(dokument)
        )

        return runBlocking(Dispatchers.IO) {
            klient.journalfoerDok(request)
        }.also {
            logger.info("Journalført PDF (søknad id $soeknadId) med respons: $it")
        }
    }
}
