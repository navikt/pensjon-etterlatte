package no.nav.etterlatte

import io.confluent.kafka.schemaregistry.client.SchemaRegistryClientConfig
import io.confluent.kafka.serializers.AbstractKafkaSchemaSerDeConfig
import io.confluent.kafka.serializers.KafkaAvroSerializer
import org.apache.kafka.clients.CommonClientConfigs
import org.apache.kafka.clients.producer.ProducerConfig
import org.apache.kafka.common.config.SaslConfigs
import org.apache.kafka.common.config.SslConfigs
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.io.File
import java.util.*
import org.apache.kafka.common.security.auth.SecurityProtocol

class KafkaConfig {
    private val log: Logger = LoggerFactory.getLogger(KafkaConfig::class.java)

    internal fun producerConfig(env: Map<String, String>) = Properties().apply {
        this[CommonClientConfigs.BOOTSTRAP_SERVERS_CONFIG] = env["KAFKA_BROKERS"] ?: ""
        this[CommonClientConfigs.SECURITY_PROTOCOL_CONFIG] = SecurityProtocol.SSL.name

        this[ProducerConfig.CLIENT_ID_CONFIG] = if (env.containsKey("NAIS_APP_NAME")) env["NAIS_APP_NAME"] else UUID.randomUUID().toString()
        this[ProducerConfig.ACKS_CONFIG] = "1"
        this[ProducerConfig.LINGER_MS_CONFIG] = "0"
        this[ProducerConfig.MAX_IN_FLIGHT_REQUESTS_PER_CONNECTION] = "1"
        this[ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG] = KafkaAvroSerializer::class.java
        this[ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG] = KafkaAvroSerializer::class.java

        this[AbstractKafkaSchemaSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG] = env["KAFKA_SCHEMA_REGISTRY"] ?: ""
        this[SchemaRegistryClientConfig.BASIC_AUTH_CREDENTIALS_SOURCE] = "USER_INFO"
        this[SchemaRegistryClientConfig.USER_INFO_CONFIG] = env["KAFKA_SCHEMA_REGISTRY_USER"]!! + ":" + env["KAFKA_SCHEMA_REGISTRY_PASSWORD"]!!
        //this["specific.avro.reader"] = true

        this[SslConfigs.SSL_ENDPOINT_IDENTIFICATION_ALGORITHM_CONFIG] = ""
        this[SslConfigs.SSL_TRUSTSTORE_TYPE_CONFIG] = "jks"
        this[SslConfigs.SSL_KEYSTORE_TYPE_CONFIG] = "PKCS12"
        this[SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG] = env["NAV_TRUSTSTORE_PATH"] ?: ""
        this[SslConfigs.SSL_TRUSTSTORE_PASSWORD_CONFIG] = env["NAV_TRUSTSTORE_PASSWORD"] ?: ""
        this[SslConfigs.SSL_KEYSTORE_LOCATION_CONFIG] = env["KAFKA_KEYSTORE_PATH"] ?: ""
        this[SslConfigs.SSL_KEYSTORE_PASSWORD_CONFIG] = env["KAFKA_CREDSTORE_PASSWORD"] ?: ""

        log.info("Configured '${SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG}' location ")

    }
}