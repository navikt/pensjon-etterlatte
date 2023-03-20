
import io.mockk.spyk
import io.mockk.verify
import no.nav.etterlatte.JournalpostSkrevet
import no.nav.etterlatte.mapper
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageProblems
import no.nav.helse.rapids_rivers.testsupport.TestRapid
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import soeknad.LagretSoeknad
import soeknad.SoeknadID
import soeknad.SoeknadRepository
import soeknad.UlagretSoeknad
import java.util.*

class JournalpostSkrevetTest {

    @Test
    fun `meldinger med journalpostferdigstilt blir arkivert`(){
        val db = spyk<TestRepo>()

        val testRapid = TestRapid().apply {
            JournalpostSkrevet(this, db)
        }

        testRapid.sendTestMessage(testMessage(11, 12, 1))
        testRapid.sendTestMessage(testMessage(21, 22, 2))
        testRapid.sendTestMessage(testMessage(31, 32, 3))

        assertEquals(3, db.arkiveringOk.size)
        assertEquals(0, db.arkiveringFeilet.size)
        assertEquals(12L, db.arkiveringOk[0])
        assertEquals(22L, db.arkiveringOk[1])
        assertEquals(32L, db.arkiveringOk[2])
        assertEquals(0, db.venterPaaBehandlingDoffen.size)

        verify(exactly = 3) { db.soeknadArkivert(any(), any()) }
    }

    @Test
    fun `meldinger som har soeknadFordelt satt til true får status venter på behandling`() {
        val db = spyk<TestRepo>()
        val testMessage = jsonTestMessage(11, 12, 1)
            .apply {
                this["soeknadFordelt"] = true
            }.toJson()

        val testRapid = TestRapid().apply {
            JournalpostSkrevet(this, db)
        }

        testRapid.sendTestMessage(testMessage)

        assertEquals(1, db.arkiveringOk.size)
        assertEquals(1, db.venterPaaBehandlingDoffen.size)

        verify(exactly = 1) { db.soeknadTilDoffenArkivert(any(), any()) }
        verify(exactly = 0) { db.soeknadArkivert(any(), any()) }
    }

    @Test
    fun `meldinger uten journalpostferdigstilt blir ansett som feilet`(){
        val db = spyk<TestRepo>()

        val testRapid = TestRapid().apply {
            JournalpostSkrevet(this, db)
        }

        testRapid.sendTestMessage(testMessage(11, 12))
        testRapid.sendTestMessage(testMessage(21, 22))
        testRapid.sendTestMessage(testMessage(31, 32))

        assertEquals(0, db.arkiveringOk.size)
        assertEquals(3, db.arkiveringFeilet.size)
        assertEquals(12L, db.arkiveringFeilet[0])
        assertEquals(22L, db.arkiveringFeilet[1])
        assertEquals(32L, db.arkiveringFeilet[2])

        verify(exactly = 0) { db.soeknadArkivert(any(), any()) }
    }
}

fun jsonTestMessage(journalpost: Long, soeknad: Long, dokumentInfoId: Long? = null) =
    JsonMessage("{}", MessageProblems("{}")).apply {
        this["@dokarkivRetur"] = mapper.createObjectNode().also {
            it.put("journalpostferdigstilt", false)
            it.put("journalpostId", journalpost)
            dokumentInfoId?.also { dii ->
                it.putArray("dokumenter").addObject().put("dokumentInfoId", dii)

            }
        }
        this["@lagret_soeknad_id"] = soeknad
    }

fun testMessage(journalpost: Long, soeknad: Long, dokumentInfoId: Long? = null) =
    jsonTestMessage(journalpost, soeknad, dokumentInfoId).toJson()


class TestRepo: SoeknadRepository {
    val arkiveringOk = mutableListOf<SoeknadID>()
    val arkiveringFeilet = mutableListOf<SoeknadID>()
    val venterPaaBehandlingDoffen = mutableListOf<SoeknadID>()

    override fun ferdigstillSoeknad(soeknad: UlagretSoeknad): SoeknadID {
        TODO("Not yet implemented")
    }

    override fun lagreKladd(soeknad: UlagretSoeknad): LagretSoeknad {
        TODO("Not yet implemented")
    }

    override fun soeknadSendt(id: SoeknadID) {
        TODO("Not yet implemented")
    }

    override fun soeknadArkivert(id: SoeknadID, payload: String?) {
        arkiveringOk += id
    }

    override fun soeknadTilDoffenArkivert(id: SoeknadID, payload: String?) {
        arkiveringOk += id
        venterPaaBehandlingDoffen += id
    }

    override fun soeknadHarBehandling(id: SoeknadID, sakId: Long, behandlingId: UUID) {
        TODO("Not yet implemented")
    }

    override fun soeknadFeiletArkivering(id: SoeknadID, jsonFeil: String) {
        arkiveringFeilet += id

    }

    override fun usendteSoeknader(): List<LagretSoeknad> {
        TODO("Not yet implemented")
    }

    override fun slettArkiverteSoeknader(): Int {
        TODO("Not yet implemented")
    }

    override fun finnKladd(fnr: String, kilde: String): LagretSoeknad? {
        TODO("Not yet implemented")
    }

    override fun slettKladd(fnr: String, kilde: String): SoeknadID? {
        TODO("Not yet implemented")
    }

    override fun slettOgKonverterKladd(fnr: String, kilde: String): SoeknadID? {
        TODO("Not yet implemented")
    }

    override fun slettUtgaatteKladder(): Int {
        TODO("Not yet implemented")
    }

    override fun arkiverteUtenBehandlingIDoffen(): List<LagretSoeknad> {
        TODO("Not yet implemented")
    }

}