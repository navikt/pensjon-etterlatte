package no.nav.etterlatte

import io.confluent.kafka.schemaregistry.client.SchemaRegistryClientConfig
import io.confluent.kafka.serializers.AbstractKafkaSchemaSerDeConfig
import io.confluent.kafka.serializers.KafkaAvroSerializer
import org.apache.kafka.clients.CommonClientConfigs
import org.apache.kafka.clients.producer.ProducerConfig
import org.apache.kafka.common.config.SaslConfigs
import org.apache.kafka.common.config.SslConfigs
import org.apache.kafka.common.security.auth.SecurityProtocol
import org.slf4j.Logger
import org.slf4j.LoggerFactory

class KafkaConfig {
    private val log: Logger = LoggerFactory.getLogger(KafkaConfig::class.java)

    fun getProducerConfig(env: Map<String, String>): Map<String, Any> {
        val props: MutableMap<String, Any> = HashMap()
        props[CommonClientConfigs.BOOTSTRAP_SERVERS_CONFIG] = env["KAFKA_BROKERS"] ?: ""
        props[CommonClientConfigs.SECURITY_PROTOCOL_CONFIG] = SecurityProtocol.SSL.name

        props[ProducerConfig.CLIENT_ID_CONFIG] = env["NAIS_APP_NAME"] ?: ""
        props[ProducerConfig.ACKS_CONFIG] = "1"
        props[ProducerConfig.LINGER_MS_CONFIG] = "0"
        props[ProducerConfig.MAX_IN_FLIGHT_REQUESTS_PER_CONNECTION] = "1"
        props[ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG] = KafkaAvroSerializer::class.java
        props[ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG] = KafkaAvroSerializer::class.java

        props[AbstractKafkaSchemaSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG] = env["KAFKA_SCHEMA_REGISTRY"] ?: ""
        props[SchemaRegistryClientConfig.BASIC_AUTH_CREDENTIALS_SOURCE] = "USER_INFO"
        props[SchemaRegistryClientConfig.USER_INFO_CONFIG] =
            env["KAFKA_SCHEMA_REGISTRY_USER"]!! + ':' + env["KAFKA_SCHEMA_REGISTRY_PASSWORD"]!!

        props[SslConfigs.SSL_ENDPOINT_IDENTIFICATION_ALGORITHM_CONFIG] = ""
        props[SslConfigs.SSL_TRUSTSTORE_TYPE_CONFIG] = "jks"
        props[SslConfigs.SSL_KEYSTORE_TYPE_CONFIG] = "PKCS12"
        props[SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG] = env["KAFKA_TRUSTSTORE_PATH"] ?: ""
        props[SslConfigs.SSL_TRUSTSTORE_PASSWORD_CONFIG] = env["KAFKA_CREDSTORE_PASSWORD"] ?: ""
        props[SslConfigs.SSL_KEYSTORE_LOCATION_CONFIG] = env["KAFKA_KEYSTORE_PATH"] ?: ""
        props[SslConfigs.SSL_KEYSTORE_PASSWORD_CONFIG] = env["KAFKA_CREDSTORE_PASSWORD"] ?: ""
        props[SaslConfigs.SASL_MECHANISM] = "PLAIN"

        log.info("Configured '${SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG}' location ")
        return props
    }
}