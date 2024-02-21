package no.nav.etterlatte

import no.nav.etterlatte.libs.common.logging.CORRELATION_ID
import no.nav.etterlatte.libs.common.logging.getCorrelationId
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import org.slf4j.LoggerFactory
import soeknad.LagretSoeknad
import soeknad.SoeknadID
import soeknad.SoeknadRepository
import soeknad.UlagretSoeknad
import java.time.Clock
import java.time.OffsetDateTime
import java.util.*

class SoeknadPubliserer(private val rapid: MessageContext, private val db: SoeknadRepository, private val klokke: Clock = Clock.systemUTC()) {

    private val logger = LoggerFactory.getLogger(this::class.java)

    fun publiser(soeknad: LagretSoeknad) {
        val message = JsonMessage.newMessage(mapOf(
            "@event_name" to "soeknad_innsendt",
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
            "@event_name" to "trenger_behandling",
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

    fun publiserCreateUtkastTilMinSide(soeknad: LagretSoeknad, kilde: String) {
        logger.info("Publiserer ny søknad som utkast med id=${soeknad.id}")

        val uuidFraFnrOgSoeknadId = UUID.nameUUIDFromBytes("${soeknad.fnr}${soeknad.id}".toByteArray())

        val soeknadsLenke = when(kilde){
            "barnepensjon-ui" -> "https://nav.no/barnepensjon/soknad"
            "gjenlevendepensjon-ui" -> "https://nav.no/gjenlevendepensjon/soknad"
            "omstillingsstoenad-ui" -> "https://nav.no/omstillingsstoenad/soknad"
            else -> throw Exception("Søknad mangler kilde")
        }

        val soeknadsTittel: SoeknadTittel = when(kilde){
            "barnepensjon-ui" -> SoeknadTittel("Søknad om barnepensjon", "Søknad om barnepensjon", "Application for children’s pension")
            "gjenlevendepensjon-ui" -> SoeknadTittel("Søknad om gjenlevendepensjon eller overgangsstønad", "Søknad om attlevandepensjon eller overgangsstønad", "Application for survivor’s pension or transitional benefit")
            "omstillingsstoenad-ui" -> SoeknadTittel("Søknad om omstillingsstønad", "Søknad om omstillingsstønad", "Application for adjustment allowance")
            else -> throw Exception("Søknad mangler kilde")
        }

        val message = JsonMessage.newMessage(mapOf(
            "@event_name" to "create",
            "utkastId" to uuidFraFnrOgSoeknadId,
            "ident" to soeknad.fnr,
            "link" to soeknadsLenke,
            "tittel" to soeknadsTittel.nb,
            "tittel_i18n" to mapOf(
                "nb" to soeknadsTittel.nb,
                "nn" to soeknadsTittel.nn,
                "en" to soeknadsTittel.en
            ),
            "metrics" to mapOf(
                "skjemanavn" to soeknadsTittel.nb,
            )
        ))

        rapid.publish(message.toJson())
    }

    fun publiserDeleteUtkastFraMinSide(fnr: String, id: SoeknadID) {
        logger.info("Publiserer slett søknad som utkast med id=${id}")

        val uuidFraFnrOgSoeknadId = UUID.nameUUIDFromBytes("${fnr}${id}".toByteArray())

        val message = JsonMessage.newMessage(mapOf(
            "@event_name" to "delete",
            "utkastId" to uuidFraFnrOgSoeknadId,
        ))

        rapid.publish(message.toJson())
    }
}

data class SoeknadTittel(
    val nb: String,
    val nn: String,
    val en: String
)