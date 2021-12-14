import dokarkiv.DokarkivKlient
import dokarkiv.DokumentKategori
import dokarkiv.DokumentVariant
import dokarkiv.JournalPostType
import dokarkiv.JournalpostDokument
import dokarkiv.JournalpostRequest
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.mockk
import io.mockk.slot
import no.nav.etterlatte.JournalfoeringService
import no.nav.etterlatte.Konstanter.ENHET_VIKAFOSSEN
import no.nav.etterlatte.Konstanter.SOEKNAD_TITTEL
import no.nav.etterlatte.dokarkiv.DokarkivDokument
import no.nav.etterlatte.dokarkiv.DokarkivResponse
import no.nav.etterlatte.libs.common.pdl.Gradering
import innsendtsoeknad.common.SoeknadType
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test

internal class JournalfoeringServiceTest {

    private val mockKlient = mockk<DokarkivKlient>()

    private val journalfoeringService = JournalfoeringService(mockKlient)

    @Test
    fun `Verifiser at request blir opprettet korrekt`() {
        coEvery { mockKlient.journalfoerDok(any()) } returns journalfoeringResponse()

        val soeknadId = "123"
        val fnrSoeker = "24014021406"

        val response = journalfoeringService.journalfoer(
            soeknadId,
            fnrSoeker,
            Gradering.UGRADERT,
            JournalpostDokument(SOEKNAD_TITTEL, DokumentKategori.SOK, "", listOf(DokumentVariant.ArkivPDF(""), DokumentVariant.OriginalJson(""))),
            SoeknadType.GJENLEVENDEPENSJON
        )

        assertNotNull(response)

        val requestSlot = slot<JournalpostRequest>()

        coVerify(exactly = 1) { mockKlient.journalfoerDok(capture(requestSlot)) }

        val actualRequest = requestSlot.captured

        assertEquals(SOEKNAD_TITTEL, actualRequest.tittel)
        assertEquals(JournalPostType.INNGAAENDE, actualRequest.journalpostType)

        assertEquals("PEN", actualRequest.tema)
        assertEquals("NAV_NO", actualRequest.kanal)
        assertEquals("ab0011", actualRequest.behandlingstema)

        assertNull(actualRequest.journalfoerendeEnhet, "Ugradert skal gi tom enhet")
        assertEquals(fnrSoeker, actualRequest.avsenderMottaker.id)
        assertEquals("FNR", actualRequest.avsenderMottaker.idType)
        assertEquals(fnrSoeker, actualRequest.bruker.id)
        assertEquals("FNR", actualRequest.bruker.idType)

        assertTrue(actualRequest.eksternReferanseId.contains(soeknadId))
        assertTrue(actualRequest.eksternReferanseId.contains(SOEKNAD_TITTEL))

        // Dokumenter
        assertEquals(1, actualRequest.dokumenter.size)

        val actualDokument = actualRequest.dokumenter.first()
        assertEquals(SOEKNAD_TITTEL, actualDokument.tittel)
        assertEquals(DokumentKategori.SOK, actualDokument.dokumentKategori)
        assertEquals(2, actualDokument.dokumentvarianter.size)
        assertTrue(actualDokument.dokumentvarianter.any { it is DokumentVariant.ArkivPDF })
        assertTrue(actualDokument.dokumentvarianter.any { it is DokumentVariant.OriginalJson })
    }

    @Nested
    inner class GraderingGirKorrektEnhet {

        @Test
        fun `Gradering STRENGT_FORTROLIG_UTLAND rutes til Vikafossen`() {
            val enhet = testEnhetForGradering(Gradering.STRENGT_FORTROLIG_UTLAND)
            assertEquals(ENHET_VIKAFOSSEN, enhet)
        }

        @Test
        fun `Gradering STRENGT_FORTROLIG rutes til Vikafossen`() {
            val enhet = testEnhetForGradering(Gradering.STRENGT_FORTROLIG)
            assertEquals(ENHET_VIKAFOSSEN, enhet)
        }

        @Test
        fun `Gradering FORTROLIG setter ingen enhet`() {
            val enhet = testEnhetForGradering(Gradering.FORTROLIG)
            assertNull(enhet)
        }

        @Test
        fun `Gradering UGRADERT setter ingen enhet`() {
            val enhet = testEnhetForGradering(Gradering.UGRADERT)
            assertNull(enhet)
        }

        private fun testEnhetForGradering(gradering: Gradering): String? {
            coEvery { mockKlient.journalfoerDok(any()) } returns journalfoeringResponse()

            journalfoeringService.journalfoer("", "", gradering, mockk(), SoeknadType.GJENLEVENDEPENSJON)

            val requestSlot = slot<JournalpostRequest>()

            coVerify(exactly = 1) { mockKlient.journalfoerDok(capture(requestSlot)) }

            return requestSlot.captured.journalfoerendeEnhet
        }
    }

    private fun journalfoeringResponse(
        journalpostId: String = "467010363",
        ferdigstilt: Boolean = true
    ): DokarkivResponse =
        DokarkivResponse(
            journalpostId = journalpostId,
            journalpostferdigstilt = ferdigstilt,
            dokumenter = listOf(DokarkivDokument("123"))
        )
}
