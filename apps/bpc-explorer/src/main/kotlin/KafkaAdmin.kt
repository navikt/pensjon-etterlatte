package no.nav.etterlatte

import org.apache.kafka.clients.CommonClientConfigs
import org.apache.kafka.clients.admin.AdminClient
import org.apache.kafka.clients.admin.OffsetSpec
import org.apache.kafka.common.TopicPartition
import org.apache.kafka.common.config.SaslConfigs
import org.apache.kafka.common.config.SslConfigs
import org.apache.kafka.common.security.auth.SecurityProtocol

class KafkaAdmin(conf: Map<String, String>) {
    private val client: AdminClient = AdminClient.create(chooseConfigType(conf).kafkaBaseConfig())

    fun groups() = client.listConsumerGroups().all().get().map { it.groupId() }
    fun topic(topic: String) = client
        .describeTopics(listOf(topic))
        .values()[topic]!!
        .get()
        .partitions()
        .let {
            client.listOffsets(it.map {
                TopicPartition(topic, it.partition()) to OffsetSpec.latest()
            }.toMap())
        }
        .all()
        .get()
        .map { it.key.partition() to it.value.offset() }
    fun offsets(group: String) = client.listConsumerGroupOffsets(group).partitionsToOffsetAndMetadata().get().map {
        PartitionOffset(it.key.topic(), it.key.partition(), it.value.offset())
    }
}

data class PartitionOffset(
    val topic: String,
    val partition: Int,
    val offset: Long
)

private fun chooseConfigType(env: Map<String, String>) = if(env.containsKey("KAFKA_CREDSTORE_PASSWORD")) gcpConfig(env) else localConfig(env)

private fun gcpConfig(env: Map<String, String>) =
    KafkaConfig(
        bootstrapServers = env.getValue("KAFKA_BROKERS"),
        truststore = env["KAFKA_TRUSTSTORE_PATH"],
        truststorePassword = env.getValue("KAFKA_CREDSTORE_PASSWORD"),
        keystoreLocation = env.getValue("KAFKA_KEYSTORE_PATH"),
        keystorePassword = env.getValue("KAFKA_CREDSTORE_PASSWORD"),
    )

private fun localConfig(env: Map<String, String>) =
    KafkaConfig(
        bootstrapServers = env.getValue("KAFKA_BROKERS")
    )


class KafkaConfig(

private val bootstrapServers: String,
private val truststore: String? = null,
private val truststorePassword: String? = null,
private val javaKeystore: String? = "jks",
private val pkcs12: String? = "PKCS12",
private val keystoreLocation: String? = null,
private val keystorePassword: String? = null,
) {

    fun kafkaBaseConfig() = mutableMapOf<String, Any?>().apply {

        if(keystoreLocation.isNullOrBlank() || keystorePassword.isNullOrBlank()){
            put(CommonClientConfigs.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers)
            put(SaslConfigs.SASL_MECHANISM, "PLAIN")
            put(CommonClientConfigs.SECURITY_PROTOCOL_CONFIG, "SASL_PLAINTEXT")
        } else {
            put(CommonClientConfigs.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers)
            put(CommonClientConfigs.SECURITY_PROTOCOL_CONFIG, SecurityProtocol.SSL.name)
            put(SslConfigs.SSL_ENDPOINT_IDENTIFICATION_ALGORITHM_CONFIG, "")
            put(SslConfigs.SSL_TRUSTSTORE_TYPE_CONFIG, javaKeystore)
            put(SslConfigs.SSL_KEYSTORE_TYPE_CONFIG, pkcs12)
            put(SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG, truststore)
            put(SslConfigs.SSL_TRUSTSTORE_PASSWORD_CONFIG, truststorePassword)
            put(SslConfigs.SSL_KEYSTORE_LOCATION_CONFIG, keystoreLocation)
            put(SslConfigs.SSL_KEYSTORE_PASSWORD_CONFIG, keystorePassword)
        }
    }
}
