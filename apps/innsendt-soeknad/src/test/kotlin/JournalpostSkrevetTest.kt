
import io.mockk.spyk
import io.mockk.verify
import no.nav.etterlatte.JournalpostSkrevet
import no.nav.helse.rapids_rivers.testsupport.TestRapid
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

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


