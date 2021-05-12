package no.nav.etterlatte

import com.fasterxml.jackson.databind.node.ObjectNode
import no.nav.helse.rapids_rivers.MessageContext

class SoeknadPubliserer(val rapid: MessageContext, val db: SoeknadRepository) {
    fun publiser(soeknad: LagretSoeknad){
        mapper.createObjectNode().apply {
            put("@event_name", "soeknad_innsendt")
            set<ObjectNode>("@skjema_info", mapper.readTree(soeknad.soeknad))
            set<ObjectNode>("@journalpostInfo", mapper.valueToTree(JournalPostInfo("tittel", AvsenderMottaker(soeknad.fnr, "navn", "FNR"), Bruker(soeknad.fnr, "FNR"))))
            put("@lagret_soeknad_id", soeknad.id)
            put("@template", "soeknad")
            rapid.publish(soeknad.id.toString(), toJson())
        }
        db.soeknadSendt(soeknad)
    }
}

data class JournalPostInfo(
    val tittel: String,
    val avsenderMottaker: AvsenderMottaker,
    val bruker: Bruker
)

data class AvsenderMottaker(
    val id: String,
    val navn:String,
    val idType: String
)

data class Bruker(
    val id: String,
    val idType: String
)