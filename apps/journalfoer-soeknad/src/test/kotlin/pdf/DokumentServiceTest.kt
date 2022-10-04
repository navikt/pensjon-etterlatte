package pdf

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import dokarkiv.DokumentKategori
import dokarkiv.DokumentVariant
import io.ktor.client.plugins.ResponseException
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.mockk
import io.mockk.slot
import no.nav.etterlatte.Konstanter.SOEKNAD_TITTEL
import no.nav.etterlatte.pdf.DokumentService
import no.nav.etterlatte.pdf.PdfGeneratorException
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.util.Base64

internal class DokumentServiceTest {

    private val mockKlient = mockk<PdfGeneratorKlient>()

    private val service = DokumentService(mockKlient)

    private val mapper = jacksonObjectMapper()

    private val soeknadId = "12"
    private val template = "gjenlevendepensjon"
    private val skjemaInfo = mapper.readTree("""{"søknadInnhold":{"forNav":{"saksnummer":123,"søknadsId":321,"søknadOpprettet":"Enellerannengang"},"personopplysninger":{"navn":{"fornavn":"Dolly","mellomnavn":"D.","etternavn":"Duck"}}}}""")

    @Test
    fun `Opprettelse av dokumenter fungerer som forventet`() {
        coEvery { mockKlient.genererPdf(any(), any()) } returns "et lite pdf-dokument".toByteArray()
        val dokument = service.opprettJournalpostDokument(soeknadId, skjemaInfo, template)

        assertEquals(SOEKNAD_TITTEL, dokument.tittel)
        assertEquals(DokumentKategori.SOK, dokument.dokumentKategori)

        val dokumentvarianter = dokument.dokumentvarianter
        assertEquals(2, dokumentvarianter.size)

        val arkivPdf = dokumentvarianter.find { it is DokumentVariant.ArkivPDF }
        assertNotNull(arkivPdf!!.fysiskDokument)

        val originalJson = dokumentvarianter.find { it is DokumentVariant.OriginalJson }
        assertNotNull(originalJson!!.fysiskDokument)

        coVerify(exactly = 1) { mockKlient.genererPdf(skjemaInfo, template) }
    }

    @Test
    fun `PDF genereres med korrekt data`() {
        coEvery { mockKlient.genererPdf(any(), any()) } returns "et lite pdf-dokument".toByteArray()
        service.opprettJournalpostDokument(soeknadId, skjemaInfo, template)

        val skjemaInfoSlot = slot<JsonNode>()
        val templateSlot = slot<String>()

        coVerify(exactly = 1) { mockKlient.genererPdf(capture(skjemaInfoSlot), capture(templateSlot)) }

        assertEquals(skjemaInfo, skjemaInfoSlot.captured)
        assertEquals(template, templateSlot.captured)
    }

    @Test
    fun `PDF skal genereres med korrekt data selv om det feiler på de første to kallene`() {
        coEvery { mockKlient.genererPdf(any(), any()) } throws
                ResponseException(mockk(), "") andThenThrows
                ResponseException(mockk(), "Test") andThen
                "et lite pdf-dokument".toByteArray()

        val dokument = service.opprettJournalpostDokument(soeknadId, skjemaInfo, template)

        coVerify(exactly = 3) { mockKlient.genererPdf(any(), any()) }
        val arkivPdf = dokument.dokumentvarianter.find { it is DokumentVariant.ArkivPDF }
        assertEquals(arkivPdf?.fysiskDokument, Base64.getEncoder().encodeToString("et lite pdf-dokument".toByteArray()))
    }

    @Test
    fun `Feil mot generering av PDF skal forsøke tre ganger og kaste egen exception`() {
        coEvery { mockKlient.genererPdf(any(), any()) } throws ResponseException(mockk(), "")
        assertThrows<PdfGeneratorException> {
            service.opprettJournalpostDokument(soeknadId, skjemaInfo, template)
        }

        coVerify(exactly = 3) { mockKlient.genererPdf(any(), any()) }
    }
}
