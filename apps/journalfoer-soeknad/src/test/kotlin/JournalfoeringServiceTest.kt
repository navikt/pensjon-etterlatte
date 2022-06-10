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
import no.nav.etterlatte.Konstanter.SOEKNAD_TITTEL
import no.nav.etterlatte.dokarkiv.DokarkivDokument
import no.nav.etterlatte.dokarkiv.DokarkivResponse
import no.nav.etterlatte.libs.common.innsendtsoeknad.gjenlevendepensjon.Gjenlevendepensjon
import no.nav.etterlatte.libs.common.pdl.Gradering
import no.nav.etterlatte.libs.common.test.InnsendtSoeknadFixtures
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test

internal class JournalfoeringServiceTest {

    private val mockKlient = mockk<DokarkivKlient>()
    private val journalfoeringService = JournalfoeringService(mockKlient)
    private val soeknad: Gjenlevendepensjon = InnsendtSoeknadFixtures.gjenlevendepensjon()

    @Test
    fun `Verifiser at request blir opprettet korrekt`() {
        coEvery { mockKlient.journalfoerDok(any()) } returns journalfoeringResponse()

        val soeknadId = "123"
        val fnrSoeker = "24014021406"

        val response = journalfoeringService.journalfoer(
            soeknadId,
            fnrSoeker,
            Gradering.UGRADERT,
            JournalpostDokument(
                SOEKNAD_TITTEL,
                DokumentKategori.SOK,
                "",
                listOf(DokumentVariant.ArkivPDF(""), DokumentVariant.OriginalJson(""))
            ),
            soeknad
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

        assertEquals(actualRequest.journalfoerendeEnhet, "4862")
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
