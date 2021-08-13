package no.nav.etterlatte

import io.confluent.kafka.serializers.KafkaAvroSerializer
import org.apache.kafka.clients.CommonClientConfigs
import org.apache.kafka.clients.producer.ProducerConfig
import org.apache.kafka.common.config.SaslConfigs
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.util.*

class KafkaConfig(
    private val bootstrapServers: String,
    private val clientId: String? = null,
    private val username: String? = null,
    private val password: String? = null,
    private val truststore: String? = null,
    private val truststorePassword: String? = null,
    private val schemaRegistryUrl: String? = null,
    private val acksConfig: String? = null,

    ) {


    private val log: Logger = LoggerFactory.getLogger("no.pensjon.etterlatte")

    internal fun producerConfig() = Properties().apply {
        put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers)
        put(ProducerConfig.ACKS_CONFIG, acksConfig)
        put(ProducerConfig.MAX_IN_FLIGHT_REQUESTS_PER_CONNECTION, "1")
        put(ProducerConfig.LINGER_MS_CONFIG, "0")
        put(ProducerConfig.RETRIES_CONFIG, "0")
        put(ProducerConfig.BATCH_SIZE_CONFIG, "1")
        put(ProducerConfig.CLIENT_ID_CONFIG, clientId)
        put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, KafkaAvroSerializer::class.java)
        put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, KafkaAvroSerializer::class.java)
        put("schema.registry.url", schemaRegistryUrl)
        put(CommonClientConfigs.SECURITY_PROTOCOL_CONFIG, "SASL_PLAINTEXT")
        put(SaslConfigs.SASL_MECHANISM, "PLAIN")
        put(SaslConfigs.DEFAULT_SASL_MECHANISM, "PLAIN")

        put(
            SaslConfigs.SASL_JAAS_CONFIG,
            "org.apache.kafka.common.security.plain.PlainLoginModule required username=\"$username\" password=\"$password\";"
        )
        println("gfsdjklgjdfkl")
        println(username)
    }
}