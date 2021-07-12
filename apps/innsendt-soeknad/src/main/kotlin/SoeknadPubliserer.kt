package no.nav.etterlatte

import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import java.time.Clock
import java.time.OffsetDateTime

class SoeknadPubliserer(private val rapid: MessageContext, private val db: SoeknadRepository, private val klokke: Clock = Clock.systemUTC()) {
    fun publiser(soeknad: LagretSoeknad){
        JsonMessage.newMessage(mapOf(
            "@event_name" to "soeknad_innsendt",
            "@skjema_info" to mapper.readTree(soeknad.soeknad),
            "@lagret_soeknad_id" to soeknad.id,
            "@template" to "soeknad",
            "@fnr_soeker" to soeknad.fnr,
            "@hendelse_gyldig_til" to OffsetDateTime.now(klokke).plusMinutes(30L).toString()
        )).apply {
            rapid.publish(soeknad.id.toString(), toJson())
        }
        db.soeknadSendt(soeknad)
    }
}
