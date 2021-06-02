
import no.nav.etterlatte.JournalpostSkrevet
import no.nav.etterlatte.LagretSoeknad
import no.nav.etterlatte.SoeknadRepository
import no.nav.etterlatte.UlagretSoeknad
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageProblems
import no.nav.helse.rapids_rivers.testsupport.TestRapid
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.time.OffsetDateTime
import java.time.ZoneId
import java.time.temporal.ChronoUnit

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

    @Test
    fun test2(){
        println(OffsetDateTime.now(ZoneId.of("UTC")).plusMinutes(30L).truncatedTo(ChronoUnit.SECONDS).toString())

    }
}
fun testMessage(journalpost: Long, soeknad: Long) =
    JsonMessage("{}", MessageProblems("{}")).apply {
        this["@dokarkivRetur"] = journalpost
        this["@lagret_soeknad_id"] = soeknad

    }.toJson()


class TestRepo: SoeknadRepository {
    val journalfoerteSoeknader = mutableListOf<LagretSoeknad>()
    override fun nySoeknad(soeknad: UlagretSoeknad): LagretSoeknad {
        TODO("Not yet implemented")
    }

    override fun soeknadSendt(soeknad: LagretSoeknad) {
        TODO("Not yet implemented")
    }

    override fun soeknadArkivert(soeknad: LagretSoeknad) {
        journalfoerteSoeknader += soeknad
    }

    override fun usendteSoeknader(): List<LagretSoeknad> {
        TODO("Not yet implemented")
    }

}