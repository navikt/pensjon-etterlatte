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
import no.nav.etterlatte.dokarkiv.DokarkivDokument
import no.nav.etterlatte.dokarkiv.DokarkivResponse
import no.nav.etterlatte.dokarkiv.JournalpostHelper
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadType
import no.nav.etterlatte.libs.common.innsendtsoeknad.omstillingsstoenad.Omstillingsstoenad
import no.nav.etterlatte.libs.pdl.Gradering
import no.nav.etterlatte.libs.utils.test.InnsendtSoeknadFixtures
import no.nav.etterlatte.libs.utils.test.avdoedMedUtenlandsopphold
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test

internal class JournalfoeringServiceTest {

    private val mockKlient = mockk<DokarkivKlient>()
    private val journalfoeringService = JournalfoeringService(mockKlient)
    private val soeknad: Omstillingsstoenad = InnsendtSoeknadFixtures.omstillingsSoeknad(
        avdoed = avdoedMedUtenlandsopphold()
    )

    @Test
    fun `Verifiser at request blir opprettet korrekt`() {
        coEvery { mockKlient.journalfoerDok(any(), any()) } returns journalfoeringResponse()

        val soeknadId = "123"
        val fnrSoeker = "24014021406"
        val soeknadType = SoeknadType.BARNEPENSJON
        val tittel = JournalpostHelper.opprettTittel(soeknadType)

        val response = journalfoeringService.journalfoer(
            soeknadId,
            fnrSoeker,
            Gradering.UGRADERT,
            JournalpostDokument(
                tittel,
                DokumentKategori.SOK,
                "",
                listOf(DokumentVariant.ArkivPDF(""), DokumentVariant.OriginalJson(""))
            ),
            soeknad,
            "PEN",
            null,
            false,
            null,
            tittel
            )

        assertNotNull(response)

        val requestSlot = slot<JournalpostRequest>()

        coVerify(exactly = 1) { mockKlient.journalfoerDok(capture(requestSlot), false) }

        val actualRequest = requestSlot.captured

        assertEquals(tittel, actualRequest.tittel)
        assertEquals(JournalPostType.INNGAAENDE, actualRequest.journalpostType)

        assertEquals("PEN", actualRequest.tema)
        assertEquals("NAV_NO", actualRequest.kanal)
        assertNull(actualRequest.behandlingstema, "Behandlingstema skal ikke være satt")

        assertEquals("4862", actualRequest.journalfoerendeEnhet)
        assertEquals(fnrSoeker, actualRequest.avsenderMottaker.id)
        assertEquals("FNR", actualRequest.avsenderMottaker.idType)
        assertEquals(fnrSoeker, actualRequest.bruker.id)
        assertEquals("FNR", actualRequest.bruker.idType)

        assertEquals("etterlatte:omstillingsstoenad:$soeknadId", actualRequest.eksternReferanseId)

        // Dokumenter
        assertEquals(1, actualRequest.dokumenter.size)

        val actualDokument = actualRequest.dokumenter.first()
        assertEquals(tittel, actualDokument.tittel)
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
