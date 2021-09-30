import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.mockk
import io.mockk.slot
import no.nav.etterlatte.DokarkivKlient
import no.nav.etterlatte.JournalfoeringService
import no.nav.etterlatte.libs.common.journalpost.AvsenderMottaker
import no.nav.etterlatte.libs.common.journalpost.Bruker
import no.nav.etterlatte.libs.common.journalpost.DokumentKategori
import no.nav.etterlatte.libs.common.journalpost.DokumentVariant
import no.nav.etterlatte.libs.common.journalpost.JournalPostType
import no.nav.etterlatte.libs.common.journalpost.JournalpostInfo
import no.nav.etterlatte.libs.common.journalpost.JournalpostRequest
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test

internal class JournalfoeringServiceTest {

    private val mapper = jacksonObjectMapper()

    private val mockKlient = mockk<DokarkivKlient>()

    private val journalfoeringService = JournalfoeringService(mockKlient)

    @Test
    fun `Verifiser at request blir opprettet korrekt`() {
        coEvery { mockKlient.journalfoerDok(any()) } returns journalfoeringResponse()

        val soeknadId = "123"
        val journalpostInfo = journalpostInfo()
        val skjemaInfo = skjemaInfo()

        val response = journalfoeringService.journalfoer(soeknadId, journalpostInfo, skjemaInfo, byteArrayOf())

        assertNotNull(response)

        val requestSlot = slot<JournalpostRequest>()

        coVerify(exactly = 1) { mockKlient.journalfoerDok(capture(requestSlot)) }

        val actualRequest = requestSlot.captured

        assertEquals(journalpostInfo.tittel, actualRequest.tittel)
        assertEquals(JournalPostType.INNGAAENDE, actualRequest.journalpostType)

        assertEquals("PEN", actualRequest.tema)
        assertEquals("NAV_NO", actualRequest.kanal)
        assertEquals("ab0011", actualRequest.behandlingstema)

        assertEquals(journalpostInfo.journalfoerendeEnhet, actualRequest.journalfoerendeEnhet)
        assertEquals(journalpostInfo.avsenderMottaker, actualRequest.avsenderMottaker)
        assertEquals(journalpostInfo.bruker, actualRequest.bruker)

        assertTrue(actualRequest.eksternReferanseId.contains(soeknadId))
        assertTrue(actualRequest.eksternReferanseId.contains(journalpostInfo.tittel))

        // Dokumenter
        assertEquals(1, actualRequest.dokumenter.size)

        val actualDokument = actualRequest.dokumenter.first()
        assertEquals(journalpostInfo.tittel, actualDokument.tittel)
        assertEquals(DokumentKategori.SOK, actualDokument.dokumentKategori)
        assertEquals(2, actualDokument.dokumentvarianter.size)
        assertTrue(actualDokument.dokumentvarianter.any { it is DokumentVariant.ArkivPDF })
        assertTrue(actualDokument.dokumentvarianter.any { it is DokumentVariant.OriginalJson })
    }

    private fun journalpostInfo(): JournalpostInfo {
        return JournalpostInfo(
            "tittel",
            AvsenderMottaker(id = "24014021406", navn = "Test Testesen"),
            Bruker("24014021406"),
            journalfoerendeEnhet = null
        )
    }

    private fun skjemaInfo(): ByteArray {
        val json = javaClass.getResource("/skjemaInfo.json")!!.readText()

        return mapper.writeValueAsBytes(json)
    }

    private fun journalfoeringResponse(
        journalpostId: String = "467010363",
        ferdigstilt: Boolean = true
    ): JsonNode {
        val json = """
            {
              "journalpostId": $journalpostId,
              "journalpostferdigstilt": "$ferdigstilt",
              "dokumenter": [
                {
                  "dokumentInfoId": "123"
                }
              ]
            }
        """.trimIndent()

        return mapper.readTree(json)
    }
}
