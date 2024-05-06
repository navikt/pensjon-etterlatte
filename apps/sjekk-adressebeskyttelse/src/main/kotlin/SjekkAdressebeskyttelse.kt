package no.nav.etterlatte

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.InnsendtSoeknad
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.libs.common.person.FoedselsnummerValidator
import no.nav.etterlatte.libs.utils.kafka.EventName
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River
import org.slf4j.LoggerFactory

internal class SjekkAdressebeskyttelse(
    rapidsConnection: RapidsConnection,
    private val adressebeskyttelseService: AdressebeskyttelseService
) : River.PacketListener {

    private val logger = LoggerFactory.getLogger(SjekkAdressebeskyttelse::class.java)

    init {
        River(rapidsConnection).apply {
            validate { it.rejectValue("@event_name", EventName.TRENGER_BEHANDLING) }
            validate { it.requireKey("@fnr_soeker") }
            validate { it.requireKey("@lagret_soeknad_id") }
            validate { it.requireKey("@skjema_info") }
            validate { it.rejectKey("@adressebeskyttelse") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {
        val soeknadId = packet["@lagret_soeknad_id"].asText()
        val fnrListe = packet["@skjema_info"].finnFoedselsnummer()
        val skjemaInfo = packet["@skjema_info"]
        val soeknad: InnsendtSoeknad = mapper.readValue(skjemaInfo.toString())
        logger.info("Sjekker adressebeskyttelse for søknad med ID: $soeknadId")
        val saktype = soeknad.type

        runBlocking {
            val gradering = adressebeskyttelseService.hentGradering(fnrListe, saktype)

            packet["@adressebeskyttelse"] = gradering.name
            logger.info("vurdert adressebeskyttelse til ${gradering.name}")
            context.publish(packet.toJson())
        }
    }
}

val mapper: ObjectMapper = jacksonObjectMapper()
    .enable(DeserializationFeature.READ_UNKNOWN_ENUM_VALUES_AS_NULL)
    .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
    .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
    .registerModule(JavaTimeModule())

fun Any.toJson(): String = mapper.writeValueAsString(this)


internal fun JsonNode.finnFoedselsnummer(): List<Foedselsnummer> {
    val regex = """\b(\d{11})\b""".toRegex()

    return regex.findAll(this.toString())
        .filter { FoedselsnummerValidator.isValid(it.value) }
        .map { Foedselsnummer.of(it.groupValues[1]) }
        .toList()
        .distinct()
}
