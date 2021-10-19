package no.nav.etterlatte

import no.nav.brukernotifikasjon.schemas.Beskjed
import no.nav.brukernotifikasjon.schemas.Nokkel
import no.nav.brukernotifikasjon.schemas.builders.BeskjedBuilder
import no.nav.brukernotifikasjon.schemas.builders.NokkelBuilder
import org.apache.kafka.clients.producer.KafkaProducer
import org.apache.kafka.clients.producer.Producer
import org.apache.kafka.clients.producer.ProducerRecord
import java.net.InetAddress
import java.time.LocalDateTime
import java.time.ZoneOffset
import java.util.*

class SendNotifikasjon(env: Map<String, String>) {

    private val brukernotifikasjontopic = env["BRUKERNOTIFIKASJON_BESKJED_TOPIC"]!!
    private val systembruker = env["srvuser"]
    private val passord = env["srvpwd"]
    private val bootStrapServer = env["BRUKERNOTIFIKASJON_KAFKA_BROKERS"]!!
    private var producer: Producer<Nokkel, Beskjed>? = null
    private val clientId =
        if (env.containsKey("NAIS_APP_NAME")) InetAddress.getLocalHost().hostName else UUID.randomUUID().toString()
    private val schemaRegistry = env["BRUKERNOTIFIKASJON_KAFKA_SCHEMA_REGISTRY"]
    private val trustStorePassword = env["NAV_TRUSTSTORE_PASSWORD"]
    private val trustStore = env["NAV_TRUSTSTORE_PATH"]
    private val acksConfig = "all"

    // notifikasjon
    private val notifikasjonsTekst = "Vi har mottatt søknaden din om gjenlevendepensjon"
    private val grupperingsId = "ETTERLATTE"

    // opprettNotifikasjon
    private val sikkerhetsNivaa = 4
    private val eksternVarsling = false


    fun startuptask() {
        producer = KafkaProducer(
            KafkaConfig(
                bootstrapServers = bootStrapServer,
                clientId = clientId,
                username = systembruker,
                password = passord,
                schemaRegistryUrl = schemaRegistry,
                truststorePassword = trustStorePassword,
                truststore = trustStore,
                acksConfig = acksConfig
            ).producerConfig()
        )
    }

    fun sendMessage(ident: String) {
        val nokkel = NokkelBuilder()
            .withSystembruker(systembruker)
            .withEventId(UUID.randomUUID().toString())
            .build()
        val beskjed = opprettBeskjed(ident)

        producer?.send(ProducerRecord(brukernotifikasjontopic, nokkel, beskjed))
    }

    internal fun opprettBeskjed(ident: String): Beskjed {
        val now = LocalDateTime.now(ZoneOffset.UTC)
        val weekFromNow = now.plusDays(7)

        return BeskjedBuilder()
            .withFodselsnummer(ident)
            .withGrupperingsId(grupperingsId)
            .withTekst(notifikasjonsTekst)
            .withTidspunkt(now)
            .withSynligFremTil(weekFromNow)
            .withSikkerhetsnivaa(sikkerhetsNivaa)
            .withEksternVarsling(eksternVarsling)
            //.withPrefererteKanaler(null)
            //.withPrefererteKanaler(PreferertKanal.SMS)
            .build()
    }
}
