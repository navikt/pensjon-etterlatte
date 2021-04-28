
import no.nav.etterlatte.JournalpostSkrevet
import no.nav.helse.rapids_rivers.testsupport.TestRapid
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class JournalpostSkrevetTest {

    @Test
    fun test(){
        val db = TestRepo()

        val testRapid = TestRapid().apply {
            JournalpostSkrevet(this, db)
        }

        testRapid.sendTestMessage(testMessage(11, 12))
        testRapid.sendTestMessage(testMessage(21, 22))
        testRapid.sendTestMessage(testMessage(31, 32))


        assertEquals(12L, db.journalfoerteSoeknader[0].id)
        assertEquals(22L, db.journalfoerteSoeknader[1].id)
        assertEquals(32L, db.journalfoerteSoeknader[2].id)

    }
}
