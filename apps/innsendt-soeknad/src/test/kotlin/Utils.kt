import no.nav.etterlatte.mapper
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageProblems
import soeknad.LagretSoeknad
import soeknad.SoeknadID
import soeknad.SoeknadRepository
import soeknad.UlagretSoeknad
import java.util.*

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
    val harBehandlingDoffen = mutableListOf<SoeknadID>()

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
        arkiveringOk += id
        harBehandlingDoffen += id
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