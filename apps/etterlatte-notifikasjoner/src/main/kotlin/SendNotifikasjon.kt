package no.nav.etterlatte

import no.nav.brukernotifikasjon.schemas.Beskjed
import no.nav.brukernotifikasjon.schemas.Nokkel
import no.nav.brukernotifikasjon.schemas.builders.NokkelBuilder
import org.apache.kafka.clients.producer.KafkaProducer
import org.apache.kafka.clients.producer.ProducerRecord
import java.net.InetAddress
import java.util.*

class SendNotifikasjon (env: Map<String, String>){

    private val brukernotifikasjontopic = env["BRUKERNOTIFIKASJON_BESKJED_TOPIC"]!!
    private val systembruker = env["srvuser"]
    private val passord = env["srvpwd"]
    private val bootStrapServer = env["BRUKERNOTIFIKASJON_KAFKA_BROKERS"]!!
    private var producer: KafkaProducer<Nokkel, Beskjed>? = null
    private val clientId = if (env.containsKey("NAIS_APP_NAME")) InetAddress.getLocalHost().hostName else UUID.randomUUID().toString()
    private val schemaRegistry = env["BRUKERNOTIFIKASJON_KAFKA_SCHEMA_REGISTRY"]
    private val trustStorePassword = env["NAV_TRUSTSTORE_PASSWORD"]
    private val trustStore = env["NAV_TRUSTSTORE_PATH"]


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
                acksConfig = "all"
            ).producerConfig()
        )
    }
    fun sendMessage(notifikasjon: Beskjed){
        ProducerRecord(
            brukernotifikasjontopic,
            createKeyForEvent(systembruker),
            notifikasjon
        ).let { producerRecord ->
            producer?.send(producerRecord)?.get()

        }
    }

    private fun createKeyForEvent(systemUserName: String?): Nokkel {
        return NokkelBuilder()
            .withSystembruker(systemUserName)
            .withEventId(UUID.randomUUID().toString())
            .build()
    }
}