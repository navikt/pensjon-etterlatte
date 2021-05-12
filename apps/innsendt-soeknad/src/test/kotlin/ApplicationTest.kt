
import no.nav.etterlatte.LagretSoeknad
import no.nav.etterlatte.SoeknadRepository
import no.nav.etterlatte.UlagretSoeknad
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageProblems

fun testMessage(journalpost: Long, soeknad: Long) =
    JsonMessage("{}", MessageProblems("{}")).apply {
        this["@journalpostId"] = journalpost
        this["@lagret_soeknad_id"] = soeknad

    }.toJson()


class TestRepo: SoeknadRepository{
    val journalfoerteSoeknader = mutableListOf<LagretSoeknad>()
    override fun nySoeknad(soeknad: UlagretSoeknad): LagretSoeknad {
        TODO("Not yet implemented")
    }

    override fun soeknadSendt(soeknad: LagretSoeknad) {
        TODO("Not yet implemented")
    }

    override fun soeknadJournalfoert(soeknad: LagretSoeknad) {
        journalfoerteSoeknader += soeknad
    }

    override fun usendteSoeknader(): List<LagretSoeknad> {
        TODO("Not yet implemented")
    }

}