package no.nav.etterlatte

import com.fasterxml.jackson.databind.node.ObjectNode
import no.nav.helse.rapids_rivers.MessageContext
import java.time.OffsetDateTime
import java.time.ZoneId

class SoeknadPubliserer(private val rapid: MessageContext, private val db: SoeknadRepository) {
    fun publiser(soeknad: LagretSoeknad){
        mapper.createObjectNode().apply {
            put("@event_name", "soeknad_innsendt")
            set<ObjectNode>("@skjema_info", mapper.readTree(soeknad.soeknad))
            put("@lagret_soeknad_id", soeknad.id)
            put("@template", "soeknad")
            put("@fnr_soeker", soeknad.fnr)
            put("@hendelse_gyldig_til", OffsetDateTime.now(ZoneId.of("UTC")).plusMinutes(30L).toString())
            rapid.publish(soeknad.id.toString(), toJson())
        }
        db.soeknadSendt(soeknad)
    }
}
