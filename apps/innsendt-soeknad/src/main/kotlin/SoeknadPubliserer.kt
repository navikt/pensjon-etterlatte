package no.nav.etterlatte

import com.fasterxml.jackson.databind.node.ObjectNode
import no.nav.helse.rapids_rivers.MessageContext

class SoeknadPubliserer(private val rapid: MessageContext, private val db: SoeknadRepository) {
    fun publiser(soeknad: LagretSoeknad){
        mapper.createObjectNode().apply {
            put("@event_name", "soeknad_innsendt")
            set<ObjectNode>("@skjema_info", mapper.readTree(soeknad.soeknad))
            put("@lagret_soeknad_id", soeknad.id)
            put("@template", "soeknad")
            put("@fnr_soeker", soeknad.fnr)
            rapid.publish(soeknad.id.toString(), toJson())
        }
        db.soeknadSendt(soeknad)
    }
}
