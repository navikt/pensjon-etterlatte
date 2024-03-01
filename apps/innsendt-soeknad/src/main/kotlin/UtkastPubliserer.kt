package no.nav.etterlatte

import no.nav.etterlatte.kafka.KafkaProdusent
import no.nav.helse.rapids_rivers.JsonMessage
import org.slf4j.LoggerFactory
import soeknad.LagretSoeknad
import soeknad.SoeknadID
import java.util.*

class UtkastPubliserer(private val producer: KafkaProdusent<String, String>, private val url: String) {

    private val logger = LoggerFactory.getLogger(this::class.java)

    fun publiserCreateUtkastTilMinSide(soeknad: LagretSoeknad, kilde: String) {
        logger.info("Publiserer ny søknad som utkast med id=${soeknad.id}")

        val uuidFraFnrOgSoeknadId = UUID.nameUUIDFromBytes("${soeknad.fnr}${soeknad.id}".toByteArray())

        val soeknadsLenke = when(kilde){
            "barnepensjon-ui" -> "$url/barnepensjon/soknad"
            "gjenlevendepensjon-ui" -> "$url/gjenlevendepensjon/soknad"
            "omstillingsstoenad-ui" -> "$url/omstillingsstonad/soknad"
            else -> throw Exception("Søknad mangler kilde")
        }

        val soeknadsTittel: SoeknadTittel = when(kilde){
            "barnepensjon-ui" -> SoeknadTittel("Søknad om barnepensjon", "Søknad om barnepensjon", "Application for children’s pension")
            "gjenlevendepensjon-ui" -> SoeknadTittel("Søknad om gjenlevendepensjon eller overgangsstønad", "Søknad om attlevandepensjon eller overgangsstønad", "Application for survivor’s pension or transitional benefit")
            "omstillingsstoenad-ui" -> SoeknadTittel("Søknad om omstillingsstønad", "Søknad om omstillingsstønad", "Application for adjustment allowance")
            else -> throw Exception("Søknad mangler kilde")
        }

        val message = JsonMessage.newMessage(mapOf(
            "@event_name" to "created",
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

        producer.publiser(uuidFraFnrOgSoeknadId.toString(), message.toJson())
    }

    fun publiserDeleteUtkastFraMinSide(fnr: String, id: SoeknadID) {
        logger.info("Publiserer slett søknad som utkast med id=${id}")

        val uuidFraFnrOgSoeknadId = UUID.nameUUIDFromBytes("${fnr}${id}".toByteArray())

        val message = JsonMessage.newMessage(mapOf(
            "@event_name" to "deleted",
            "utkastId" to uuidFraFnrOgSoeknadId,
        ))

        producer.publiser(uuidFraFnrOgSoeknadId.toString(), message.toJson())
    }
}

data class SoeknadTittel(
    val nb: String,
    val nn: String,
    val en: String
)