import dokarkiv.DokumentKategori
import dokarkiv.JournalpostDokument
import io.mockk.called
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import no.nav.etterlatte.JournalfoerBarnepensjonSoeknadForPesys
import no.nav.etterlatte.JournalfoeringService
import no.nav.etterlatte.dokarkiv.DokarkivDokument
import no.nav.etterlatte.dokarkiv.DokarkivResponse
import no.nav.etterlatte.pdf.DokumentService
import no.nav.helse.rapids_rivers.testsupport.TestRapid
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.time.Clock
import java.time.LocalDateTime
import java.time.Month
import java.time.ZoneId
import java.time.ZoneOffset

internal class JournalfoerBarnepensjonSoeknadForPesysTest{
    val clock: Clock = Clock
        .fixed(LocalDateTime.of(2020, Month.MAY, 5, 14, 5, 2)
            .toInstant(ZoneOffset.UTC), ZoneId.of("UTC"))
    private val journalfoeringService = mockk<JournalfoeringService>()
    private val dokumentservice = mockk<DokumentService>()
    @Test
    fun `Skal lese søknader som er fordelt til Pesys`(){

        every { dokumentservice.opprettJournalpostDokument("13", any(), any()) } returns
                JournalpostDokument("tittel", DokumentKategori.SOK, "", emptyList())
        every { journalfoeringService.journalfoer(
            "13",
            "5555555555",
            any(),any(),any(),any(), any(),
            false,
            null) } returns
                DokarkivResponse(
            journalpostId = "123",
            journalpostferdigstilt = true,
            dokumenter = listOf(DokarkivDokument("123"))
        )

        val rapid = TestRapid()
        JournalfoerBarnepensjonSoeknadForPesys(rapid, dokumentservice, journalfoeringService, clock)
        rapid.sendTestMessage(getResource("barnepensjonTilPesys.json"))
        assertEquals(1, rapid.inspektør.size)
        rapid.inspektør.message(0).also {
            assertTrue(it.has("@dokarkivRetur"))
            assertEquals("123", it["@dokarkivRetur"]["journalpostId"].textValue())
        }
    }

    @Test
    fun `Skal ikke lese søknader som er fordelt til Doffen`(){
        val rapid = TestRapid()
        JournalfoerBarnepensjonSoeknadForPesys(rapid, dokumentservice, journalfoeringService, clock)
        rapid.sendTestMessage(getResource("barnepensjonTilDoffen.json"))
        assertEquals(0, rapid.inspektør.size)
        verify { dokumentservice wasNot called }
        verify { journalfoeringService wasNot called }
    }

    @Test
    fun `Skal ikke lese søknader som ikke er fordelt`(){
        val rapid = TestRapid()
        JournalfoerBarnepensjonSoeknadForPesys(rapid, dokumentservice, journalfoeringService, clock)
        rapid.sendTestMessage(getResource("fullMessage.json"))
        assertEquals(0, rapid.inspektør.size)
        verify { dokumentservice wasNot called }
        verify { journalfoeringService wasNot called }
    }

    private fun getResource(file: String): String =
        javaClass.getResource(file)!!.readText().replace(Regex("[\n\t]"), "")

}