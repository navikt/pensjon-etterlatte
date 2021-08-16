
import no.nav.etterlatte.JournalpostSkrevet
import no.nav.etterlatte.LagretSoeknad
import no.nav.etterlatte.SoeknadRepository
import no.nav.etterlatte.UlagretSoeknad
import no.nav.etterlatte.mapper
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageProblems
import no.nav.helse.rapids_rivers.testsupport.TestRapid
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class JournalpostSkrevetTest {

    @Test
    fun `meldinger med journalpostferdigstilt blir arkivert`(){
        val db = TestRepo()

        val testRapid = TestRapid().apply {
            JournalpostSkrevet(this, db)
        }

        testRapid.sendTestMessage(testMessage(11, 12, 1))
        testRapid.sendTestMessage(testMessage(21, 22, 2))
        testRapid.sendTestMessage(testMessage(31, 32, 3))

        assertEquals(3, db.arkiveringOk.size)
        assertEquals(0, db.arkiveringFeilet.size)
        assertEquals(12L, db.arkiveringOk[0].id)
        assertEquals(22L, db.arkiveringOk[1].id)
        assertEquals(32L, db.arkiveringOk[2].id)

    }

    @Test
    fun `meldinger uten journalpostferdigstilt blir ansett som feilet`(){
        val db = TestRepo()

        val testRapid = TestRapid().apply {
            JournalpostSkrevet(this, db)
        }

        testRapid.sendTestMessage(testMessage(11, 12))
        testRapid.sendTestMessage(testMessage(21, 22))
        testRapid.sendTestMessage(testMessage(31, 32))

        assertEquals(0, db.arkiveringOk.size)
        assertEquals(3, db.arkiveringFeilet.size)
        assertEquals(12L, db.arkiveringFeilet[0].id)
        assertEquals(22L, db.arkiveringFeilet[1].id)
        assertEquals(32L, db.arkiveringFeilet[2].id)

    }
}
fun testMessage(journalpost: Long, soeknad: Long, dokumentInfoId: Long? = null) =
    JsonMessage("{}", MessageProblems("{}")).apply {
        this["@dokarkivRetur"] = mapper.createObjectNode().also {
            it.put("journalpostferdigstilt", false)
            it.put("journalpostId", journalpost)
            dokumentInfoId?.also { dii ->
                it.putArray("dokumenter").addObject().put("dokumentInfoId", dii)

            }
        }
        this["@lagret_soeknad_id"] = soeknad

    }.toJson()


class TestRepo: SoeknadRepository {
    val arkiveringOk = mutableListOf<LagretSoeknad>()
    val arkiveringFeilet = mutableListOf<LagretSoeknad>()

    override fun lagreSoeknad(soeknad: UlagretSoeknad): LagretSoeknad {
        TODO("Not yet implemented")
    }

    override fun lagreKladd(soeknad: UlagretSoeknad): LagretSoeknad {
        TODO("Not yet implemented")
    }

    override fun soeknadSendt(soeknad: LagretSoeknad) {
        TODO("Not yet implemented")
    }

    override fun soeknadArkivert(soeknad: LagretSoeknad) {
        arkiveringOk += soeknad
    }

    override fun soeknadFeiletArkivering(soeknad: LagretSoeknad, jsonFeil: String) {
        arkiveringFeilet += soeknad

    }

    override fun usendteSoeknader(): List<LagretSoeknad> {
        TODO("Not yet implemented")
    }

    override fun slettArkiverteSoeknader() {
        TODO("Not yet implemented")
    }

    override fun soeknadFerdigstilt(soeknad: LagretSoeknad) {
        TODO("Not yet implemented")
    }

    override fun finnKladd(fnr: String): LagretSoeknad? {
        TODO("Not yet implemented")
    }

}