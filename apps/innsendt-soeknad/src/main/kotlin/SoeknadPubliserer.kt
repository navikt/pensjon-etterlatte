package no.nav.etterlatte

import no.nav.etterlatte.libs.utils.kafka.EventName
import no.nav.etterlatte.libs.utils.logging.CORRELATION_ID
import no.nav.etterlatte.libs.utils.logging.getCorrelationId
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import org.slf4j.LoggerFactory
import soeknad.LagretSoeknad
import soeknad.SoeknadRepository
import java.time.Clock
import java.time.OffsetDateTime

class SoeknadPubliserer(private val rapid: MessageContext, private val db: SoeknadRepository, private val klokke: Clock = Clock.systemUTC()) {

    private val logger = LoggerFactory.getLogger(this::class.java)

    fun publiser(soeknad: LagretSoeknad) {
        val message = JsonMessage.newMessage(mapOf(
            "@event_name" to EventName.SOEKNAD_INNSENDT,
            "@skjema_info" to mapper.readTree(soeknad.payload),
            "@lagret_soeknad_id" to soeknad.id,
            "@template" to "soeknad",
            "@fnr_soeker" to soeknad.fnr,
            "@hendelse_gyldig_til" to OffsetDateTime.now(klokke).plusMinutes(30L).toString(),
            CORRELATION_ID to getCorrelationId(),
        ))

        rapid.publish(soeknad.id.toString(), message.toJson())

        db.soeknadSendt(soeknad.id)
    }

    fun publiserBehandlingsbehov(soeknad: LagretSoeknad) {
        logger.info("Publiserer soeknad_journfoert for søknaden med id=${soeknad.id}, " +
                "for å få opprettet en behandling på saken.")
        val message = JsonMessage.newMessage(mapOf(
            "@event_name" to EventName.TRENGER_BEHANDLING,
            "@skjema_info" to mapper.readTree(soeknad.payload),
            "@lagret_soeknad_id" to soeknad.id,
            "@template" to "soeknad",
            "@fnr_soeker" to soeknad.fnr,
            "@hendelse_gyldig_til" to OffsetDateTime.now(klokke).plusMinutes(30L).toString(),
            CORRELATION_ID to getCorrelationId()
        ))
        rapid.publish(soeknad.id.toString(), message.toJson())

        db.soeknadSendt(soeknad.id)
    }
}
