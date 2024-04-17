package no.nav.etterlatte

import no.nav.etterlatte.kafka.KafkaProdusent
import no.nav.helse.rapids_rivers.JsonMessage
import org.slf4j.LoggerFactory
import soeknad.LagretSoeknad
import soeknad.SoeknadID
import java.util.*

class UtkastPubliserer(private val producer: KafkaProdusent<String, String>, private val url: String) {

    private val logger = LoggerFactory.getLogger(this::class.java)

    fun publiserOpprettUtkastTilMinSide(soeknad: LagretSoeknad, kilde: String) {
        logger.info("Publiserer ny søknad som utkast med id=${soeknad.id}")

        val uuidFraFnrOgSoeknadId = UUID.nameUUIDFromBytes("${soeknad.fnr}${soeknad.id}".toByteArray())

        val soeknadData: SoeknadData = when (kilde) {
            "barnepensjon-ui" -> SoeknadData(
                "$url/barnepensjon/soknad",
                "Søknad om barnepensjon",
                "Søknad om barnepensjon",
                "Application for children’s pension"
            )
            "omstillingsstoenad-ui" -> SoeknadData(
                "$url/omstillingsstonad/soknad",
                "Søknad om omstillingsstønad",
                "Søknad om omstillingsstønad",
                "Application for adjustment allowance"
            )
            else -> throw Exception("Søknad mangler kilde")
        }

        val message = JsonMessage.newMessage(mapOf(
            "@event_name" to "created",
            "utkastId" to uuidFraFnrOgSoeknadId,
            "ident" to soeknad.fnr,
            "link" to soeknadData.url,
            "tittel" to soeknadData.nb,
            "tittel_i18n" to mapOf(
                "nb" to soeknadData.nb,
                "nn" to soeknadData.nn,
                "en" to soeknadData.en
            ),
            "metrics" to mapOf(
                "skjemanavn" to soeknadData.nb,
            )
        ))

        producer.publiser(uuidFraFnrOgSoeknadId.toString(), message.toJson())
    }

    fun publiserSlettUtkastFraMinSide(fnr: String, id: SoeknadID) {
        logger.info("Publiserer slett søknad som utkast med id=${id}")

        val uuidFraFnrOgSoeknadId = UUID.nameUUIDFromBytes("${fnr}${id}".toByteArray())

        val message = JsonMessage.newMessage(mapOf(
            "@event_name" to "deleted",
            "utkastId" to uuidFraFnrOgSoeknadId,
        ))

        producer.publiser(uuidFraFnrOgSoeknadId.toString(), message.toJson())
    }
}

data class SoeknadData(
    val url: String,
    val nb: String,
    val nn: String,
    val en: String
)