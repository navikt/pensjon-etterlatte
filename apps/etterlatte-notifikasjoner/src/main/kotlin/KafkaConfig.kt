package no.nav.etterlatte

import io.confluent.kafka.serializers.KafkaAvroDeserializer
import org.apache.kafka.clients.CommonClientConfigs
import org.apache.kafka.clients.producer.ProducerConfig
import org.apache.kafka.common.config.SaslConfigs
import org.apache.kafka.common.config.SslConfigs
import org.slf4j.LoggerFactory
import java.io.File
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



    private val log = LoggerFactory.getLogger(this::class.java)

    internal fun producerConfig() = Properties().apply {
        putAll(kafkaBaseConfig())
        put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers)
        put(ProducerConfig.ACKS_CONFIG, acksConfig)
        put(ProducerConfig.MAX_IN_FLIGHT_REQUESTS_PER_CONNECTION, "1")
        put(ProducerConfig.LINGER_MS_CONFIG, "0")
        put(ProducerConfig.RETRIES_CONFIG, "0")
        clientId?.also { put(ProducerConfig.CLIENT_ID_CONFIG, "consumer-$it") }

        schemaRegistryUrl?.apply {
            put("schema.registry.url", this)
            put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, KafkaAvroDeserializer::class.java)
            put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, KafkaAvroDeserializer::class.java)
            put("specific.avro.reader", true)

        }

    }

    private fun kafkaBaseConfig() = Properties().apply {

            put(CommonClientConfigs.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers)
            put(SaslConfigs.SASL_MECHANISM, "PLAIN")
        if (username != null) {
            put(CommonClientConfigs.SECURITY_PROTOCOL_CONFIG, "SASL_SSL")

            put(
                    SaslConfigs.SASL_JAAS_CONFIG,
                    "org.apache.kafka.common.security.plain.PlainLoginModule required username=\"$username\" password=\"$password\";"
                )
            }
            if (!truststore.isNullOrBlank()) {
                try {
                    put(CommonClientConfigs.SECURITY_PROTOCOL_CONFIG, "SASL_SSL")
                    put(SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG, File(truststore).absolutePath)
                    put(SslConfigs.SSL_TRUSTSTORE_PASSWORD_CONFIG, truststorePassword)
                    log.info("Configured '${SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG}' location ")
                } catch (ex: Exception) {
                    log.error("Failed to set '${SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG}' location", ex)
                }
            }
        }
}