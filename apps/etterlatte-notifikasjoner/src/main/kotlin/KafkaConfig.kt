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

class KafkaConfig(
    private val bootstrapServers: String,
    private val clientId: String? = null,
    private val username: String? = null,
    private val password: String? = null,
    private val truststore: String? = null,
    private val truststorePassword: String? = null,
    private val trustStoreType: String? = null,
    private val keyStore: String? = null,
    private val keyStoreType: String? = null,
    private val keyStorePassword: String? = null,
    private val schemaRegistryUrl: String? = null,
    private val acksConfig: String? = null,

    ) {


    private val log: Logger = LoggerFactory.getLogger(KafkaConfig::class.java)

    internal fun producerConfig() = Properties().apply {
        this[ProducerConfig.BOOTSTRAP_SERVERS_CONFIG] = bootstrapServers
        this[ProducerConfig.ACKS_CONFIG] = acksConfig
        this[ProducerConfig.MAX_IN_FLIGHT_REQUESTS_PER_CONNECTION] = "1"
        this[ProducerConfig.LINGER_MS_CONFIG] = "0"
        this[ProducerConfig.CLIENT_ID_CONFIG] = clientId //TODO Må man ha 'producer' her?!
        this[ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG] = KafkaAvroSerializer::class.java
        this[ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG] = KafkaAvroSerializer::class.java
        this[AbstractKafkaSchemaSerDeConfig.SCHEMA_REGISTRY_URL_CONFIG] = schemaRegistryUrl
        this["specific.avro.reader"] = true
        this[CommonClientConfigs.BOOTSTRAP_SERVERS_CONFIG] = bootstrapServers
        this[CommonClientConfigs.SECURITY_PROTOCOL_CONFIG] = "SSL"
        this[SslConfigs.SSL_ENDPOINT_IDENTIFICATION_ALGORITHM_CONFIG] = ""
        this[SslConfigs.SSL_TRUSTSTORE_TYPE_CONFIG] = trustStoreType
        this[SslConfigs.SSL_KEYSTORE_TYPE_CONFIG] = keyStoreType
        if (!truststore.isNullOrBlank()) {
            this[SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG] = truststore
            this[SslConfigs.SSL_TRUSTSTORE_PASSWORD_CONFIG] = truststorePassword
            this[SslConfigs.SSL_KEYSTORE_LOCATION_CONFIG] = keyStore
            this[SslConfigs.SSL_KEYSTORE_PASSWORD_CONFIG] = keyStorePassword
            this[SchemaRegistryClientConfig.USER_INFO_CONFIG] = username + ":" + password
            this[SchemaRegistryClientConfig.BASIC_AUTH_CREDENTIALS_SOURCE] = "USER_INFO"
            log.info("Configured '${SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG}' location ")
        }
    }
}