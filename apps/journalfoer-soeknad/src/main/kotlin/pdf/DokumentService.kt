package no.nav.etterlatte.pdf

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import dokarkiv.DokumentKategori
import dokarkiv.DokumentVariant
import dokarkiv.JournalpostDokument
import io.ktor.client.plugins.ResponseException
import kotlinx.coroutines.runBlocking
import libs.common.util.RetryResult
import libs.common.util.retry
import no.nav.etterlatte.Konstanter.SOEKNAD_TITTEL
import org.slf4j.LoggerFactory
import pdf.PdfGenerator
import java.util.*

class DokumentService(private val klient: PdfGenerator) {
    private val logger = LoggerFactory.getLogger(DokumentService::class.java)

    private val encoder = Base64.getEncoder()

    fun opprettJournalpostDokument(soeknadId: String, skjemaInfo: JsonNode, template: String): JournalpostDokument =
        try {
            val arkivPdf = opprettArkivPdf(soeknadId, skjemaInfo, template)
            val originalJson = opprettOriginalJson(soeknadId, skjemaInfo)

            JournalpostDokument(
                tittel = SOEKNAD_TITTEL,
                dokumentKategori = DokumentKategori.SOK,
                dokumentvarianter = listOf(arkivPdf, originalJson)
            )
        } catch (e: ResponseException) {
            throw PdfGeneratorException(soeknadId, e)
        }

    private fun opprettArkivPdf(soeknadId: String, skjemaInfo: JsonNode, template: String): DokumentVariant.ArkivPDF {
        logger.info("Oppretter arkiv PDF for søknad med id $soeknadId")

        val response: RetryResult = runBlocking {
            retry {
                klient.genererPdf(skjemaInfo, template)
            }
        }

        return when (response) {
            is RetryResult.Success -> DokumentVariant.ArkivPDF(encoder.encodeToString(response.content as ByteArray))
            is RetryResult.Failure -> throw response.lastError()
        }
    }

    private fun opprettOriginalJson(soeknadId: String, skjemaInfo: JsonNode): DokumentVariant.OriginalJson {
        logger.info("Oppretter original JSON for søknad med id $soeknadId")

        val skjemaInfoBytes = jacksonObjectMapper().writeValueAsBytes(skjemaInfo)

        return DokumentVariant.OriginalJson(encoder.encodeToString(skjemaInfoBytes))
    }
}

class PdfGeneratorException(value: String, cause: Throwable) :
    Exception("Klarte ikke å generere PDF for søknad med id $value", cause)
