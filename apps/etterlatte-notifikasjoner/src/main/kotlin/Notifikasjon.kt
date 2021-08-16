package no.nav.etterlatte

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import no.nav.brukernotifikasjon.schemas.Beskjed
import no.nav.brukernotifikasjon.schemas.Nokkel
import no.nav.brukernotifikasjon.schemas.builders.BeskjedBuilder
import no.nav.brukernotifikasjon.schemas.builders.NokkelBuilder
import no.nav.brukernotifikasjon.schemas.builders.domain.PreferertKanal
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River
import org.apache.kafka.clients.producer.KafkaProducer
import org.apache.kafka.clients.producer.ProducerRecord
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.net.InetAddress
import java.net.URL
import java.time.LocalDateTime
import java.time.ZoneOffset
import java.time.temporal.ChronoUnit
import java.util.*


internal class Notifikasjon(env: Map<String, String>, rapidsConnection: RapidsConnection) :

    River.PacketListener {
    private val logger: Logger = LoggerFactory.getLogger("no.pensjon.etterlatte")

    private val brukernotifikasjontopic = env["BRUKERNOTIFIKASJON_BESKJED_TOPIC"]!!
    private val systembruker = env["srvuser"]
    private val passord = env["srvpwd"]
    private var producer: KafkaProducer<Nokkel, Beskjed>? = null

    init {

        val minRiver = River(rapidsConnection).apply {
            validate { it.demandValue("@event_name", "soeknad_innsendt") }
            validate { it.requireKey("@dokarkivRetur") }
            validate { it.requireKey("@fnr_soeker") }
            validate { it.rejectKey("@notifikasjon") }
        }

        val startuptask = {
            producer = KafkaProducer(
                KafkaConfig(
                    bootstrapServers = env["BRUKERNOTIFIKASJON_KAFKA_BROKERS"]!!,
                    clientId = if (env.containsKey("NAIS_APP_NAME")) InetAddress.getLocalHost().hostName else UUID.randomUUID()
                        .toString(),
                    username = systembruker,
                    password = passord,
                    schemaRegistryUrl = env["BRUKERNOTIFIKASJON_KAFKA_SCHEMA_REGISTRY"],
                    acksConfig = "all"
                ).producerConfig()
            )

        }
        GlobalScope.launch {
            logger.info("venter 30s for sidecars")
            delay(30L * 1000L)
            logger.info("starter kafka producer")
            startuptask()
            rapidsConnection.register(minRiver)
        }


    }

    override fun onPacket(packet: JsonMessage, context: MessageContext) {


        runBlocking {
            val dto = ProduceBeskjedDto(
                tekst = "Vi bekrefter å ha mottat din søknad om Etterlatteytelse",
                link = null,
                grupperingsid = "ETTERLATTE",
                eksternVarsling = true,
                prefererteKanaler = listOf("SMS", "EPOST")
                //prefererteKanaler = emptyList()

            )
            val objectMapper = jacksonObjectMapper()
                .registerModule(JavaTimeModule())
                .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
                .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)

            val notifikasjon = opprettNotifikasjonForIdent(packet["@fnr_soeker"].textValue(), dto)
            val notifikasjonJson = objectMapper.readTree(notifikasjon.toString())



            ProducerRecord(
                brukernotifikasjontopic,
                createKeyForEvent(systembruker),
                notifikasjon
            ).let { producerRecord ->
                producer?.send(producerRecord)?.get()

            }


            packet["@notifikasjon"] = notifikasjonJson
            context.publish(packet.toJson())
            logger.info("Notifikasjon til bruker opprettet")
        }
    }
}

private fun createKeyForEvent(systemUserName: String?): Nokkel {
    return NokkelBuilder()
        .withSystembruker(systemUserName)
        .withEventId(UUID.randomUUID().toString())
        .build()
}

private fun opprettNotifikasjonForIdent(fnr: String, dto: ProduceBeskjedDto): Beskjed {
    val now = LocalDateTime.now(ZoneOffset.UTC)
    val weekFromNow = now.plus(7, ChronoUnit.DAYS)
    val build = BeskjedBuilder()
        .withFodselsnummer(fnr)
        .withGrupperingsId(dto.grupperingsid)
        .withTekst(dto.tekst)
        .withTidspunkt(now)
        .withSynligFremTil(weekFromNow)
        .withSikkerhetsnivaa(4)
        .withEksternVarsling(true)
        .withPrefererteKanaler(PreferertKanal.SMS)
    if (!dto.link.isNullOrBlank()) {
        build.withLink(URL(dto.link))
    }
    return build.build()
}





