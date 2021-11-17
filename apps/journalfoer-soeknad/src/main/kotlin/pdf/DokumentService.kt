package no.nav.etterlatte.pdf

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import dokarkiv.DokumentKategori
import dokarkiv.DokumentVariant
import dokarkiv.JournalpostDokument
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.Konstanter.SOEKNAD_TITTEL
import org.slf4j.LoggerFactory
import pdf.PdfGenerator
import java.util.Base64

class DokumentService(private val klient: PdfGenerator) {
    private val logger = LoggerFactory.getLogger(DokumentService::class.java)

    private val encoder = Base64.getEncoder()

    fun opprettJournalpostDokument(soeknadId: String, skjemaInfo: JsonNode, template: String): JournalpostDokument {
        val arkivPdf = opprettArkivPdf(soeknadId, skjemaInfo, template)
        val originalJson = opprettOriginalJson(soeknadId, skjemaInfo)

        return JournalpostDokument(
            tittel = SOEKNAD_TITTEL,
            dokumentKategori = DokumentKategori.SOK,
            dokumentvarianter = listOf(arkivPdf, originalJson)
        )
    }

    private fun opprettArkivPdf(soeknadId: String, skjemaInfo: JsonNode, template: String): DokumentVariant.ArkivPDF {
        logger.info("Generer PDF for søknad med id $soeknadId")

        return runBlocking {
            val bytes = klient.genererPdf(skjemaInfo, template)

            DokumentVariant.ArkivPDF(encoder.encodeToString(bytes))
        }
    }

    private fun opprettOriginalJson(soeknadId: String, skjemaInfo: JsonNode): DokumentVariant.OriginalJson {
        logger.info("Generer PDF for søknad med id $soeknadId")

        val skjemaInfoBytes = jacksonObjectMapper().writeValueAsBytes(skjemaInfo)

        return DokumentVariant.OriginalJson(encoder.encodeToString(skjemaInfoBytes))
    }
}
