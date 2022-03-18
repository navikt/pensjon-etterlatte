package no.nav.etterlatte

import no.nav.brukernotifikasjon.schemas.Beskjed
import no.nav.brukernotifikasjon.schemas.Nokkel
//import no.nav.brukernotifikasjon.schemas.builders.BeskjedBuilder
//import no.nav.brukernotifikasjon.schemas.builders.NokkelBuilder
import no.nav.brukernotifikasjon.schemas.builders.BeskjedInputBuilder
import no.nav.brukernotifikasjon.schemas.builders.NokkelInputBuilder
import no.nav.brukernotifikasjon.schemas.input.BeskjedInput
import no.nav.brukernotifikasjon.schemas.input.NokkelInput

import org.apache.kafka.clients.producer.KafkaProducer
import org.apache.kafka.clients.producer.Producer
import org.apache.kafka.clients.producer.ProducerRecord
import java.net.InetAddress
import java.time.LocalDateTime
import java.time.ZoneOffset
import java.util.*

class SendNotifikasjon(env: Map<String, String>) {

    private val brukernotifikasjontopic = env["BRUKERNOTIFIKASJON_BESKJED_TOPIC"]!!

    private var producer: Producer<NokkelInput, BeskjedInput>? = null

    //Producer
    private val bootStrapServer = env["KAFKA_BROKERS"]!!
    private val clientId =
        if (env.containsKey("NAIS_APP_NAME")) env["NAIS_APP_NAME"] else UUID.randomUUID().toString()
    private val systembruker = env["srvuser"]
    private val passord = env["srvpwd"]
    private val schemauser = env["KAFKA_SCHEMA_REGISTRY_USER"]
    private val schemapassword = env["KAFKA_SCHEMA_REGISTRY_PASSWORD"]
    private val schemaRegistry = env["KAFKA_SCHEMA_REGISTRY"]
    private val trustStorePassword = env["NAV_TRUSTSTORE_PASSWORD"]
    private val trustStore = env["NAV_TRUSTSTORE_PATH"]
    private val trustStoreType = "jks"
    private val keyStore = env["KAFKA_KEYSTORE_PATH"]
    private val keyStoreType = "PKCS12"
    private val keystorePassword = env["KAFKA_CREDSTORE_PASSWORD"]
    private val acksConfig = "1"


    // notifikasjon
    private val notifikasjonsTekst = "Vi har mottatt søknaden din om gjenlevendepensjon"
    private val grupperingsId = env["BRUKERNOTIFIKASJON_KAFKA_GROUP_ID"]

    private val namespace = env["NAIS_NAMESPACE"]
    private val appname = env["NAIS_NAME"]

    // opprettNotifikasjon
    private val sikkerhetsNivaa = 4
    private val eksternVarsling = false




    fun startuptask() {
        producer = KafkaProducer(
            KafkaConfig(
                bootstrapServers = bootStrapServer,
                clientId = clientId,
                username = schemauser,
                password = schemapassword,
                schemaRegistryUrl = schemaRegistry,
                truststorePassword = trustStorePassword,
                truststore = trustStore,
                trustStoreType = trustStoreType,
                keyStore = keyStore,
                keyStoreType = keyStoreType,
                keyStorePassword = keystorePassword,
                acksConfig = acksConfig,


            ).producerConfig()
        )
    }

    fun sendMessage(ident: String) {
        val nokkel = NokkelInputBuilder()
            .withEventId(UUID.randomUUID().toString())
            .withFodselsnummer(ident)
            .withGrupperingsId(grupperingsId)
            .withNamespace(namespace)
            .withAppnavn(appname)
            .build()
        val beskjed = opprettBeskjed(ident)

        producer?.send(ProducerRecord(brukernotifikasjontopic, nokkel, beskjed))
    }

    internal fun opprettBeskjed(ident: String): BeskjedInput {
        val now = LocalDateTime.now(ZoneOffset.UTC)
        val weekFromNow = now.plusDays(7)

        return BeskjedInputBuilder()
            //.withFodselsnummer(ident)
            //.withGrupperingsId(grupperingsId)
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
