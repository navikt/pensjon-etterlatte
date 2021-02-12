package no.pensjon

import org.apache.kafka.clients.CommonClientConfigs
import org.apache.kafka.clients.producer.ProducerConfig
import org.apache.kafka.common.config.SslConfigs
import org.apache.kafka.common.security.auth.SecurityProtocol
import org.apache.kafka.common.serialization.StringSerializer
import java.lang.IllegalArgumentException
import java.net.InetAddress
import java.util.*




sealed class AppConfig(val enableKafka:Boolean) {
    abstract fun kafka(): KafkaConfig
    abstract fun aivenproducerConfig(): MutableMap<String, Any>
}



class TestConfig: AppConfig(false) {
    override fun kafka(): KafkaConfig = throw IllegalArgumentException()
    override fun aivenproducerConfig(): MutableMap<String, Any> = throw IllegalArgumentException()
}

class DevConfig: AppConfig(true) {

    private val JAVA_KEYSTORE = "jks"
    private val PKCS12 = "PKCS12"
    private val LOCALHOST = "localhost:9092"
    private val GROUP_ID_CONFIG = "helsearbeidsgiver-im-varsel-grace-period"


    override fun kafka():KafkaConfig {
        val env = System.getenv()
        return KafkaConfig(
            bootstrapServers = "b27apvl00045.preprod.local:8443,b27apvl00046.preprod.local:8443,b27apvl00047.preprod.local:8443",
            consumerGroupId =  "etterlatte-v1",
            clientId = if (env.containsKey("NAIS_APP_NAME")) InetAddress.getLocalHost().hostName else UUID.randomUUID().toString(),
            username = env["srvuser"],
            password = env["srvpwd"],
            autoCommit = env["KAFKA_AUTO_COMMIT"]?.let { "true" == it.toLowerCase()},
            maxRecords = 20,
            schemaRegistryUrl = "https://kafka-schema-registry.nais-q.adeo.no/"
        )
    }



    private fun envOrThrow(envVar: String) = System.getenv()[envVar] ?: throw IllegalStateException("$envVar er påkrevd miljøvariabel")

    override fun aivenproducerConfig() = mutableMapOf<String, Any>(
        ProducerConfig.BOOTSTRAP_SERVERS_CONFIG to envOrThrow("KAFKA_BROKERS"),
        ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG to StringSerializer::class.java.canonicalName,
        ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG to StringSerializer::class.java.canonicalName,
        ProducerConfig.ACKS_CONFIG to "all",

        CommonClientConfigs.SECURITY_PROTOCOL_CONFIG to SecurityProtocol.SSL.name,
        SslConfigs.SSL_ENDPOINT_IDENTIFICATION_ALGORITHM_CONFIG to "", //Disable server host name verification
        SslConfigs.SSL_TRUSTSTORE_TYPE_CONFIG to JAVA_KEYSTORE,
        SslConfigs.SSL_KEYSTORE_TYPE_CONFIG to PKCS12,
        SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG to envOrThrow("KAFKA_TRUSTSTORE_PATH"),
        SslConfigs.SSL_TRUSTSTORE_PASSWORD_CONFIG to envOrThrow("KAFKA_CREDSTORE_PASSWORD"),
        SslConfigs.SSL_KEYSTORE_LOCATION_CONFIG to envOrThrow("KAFKA_KEYSTORE_PATH"),
        SslConfigs.SSL_KEYSTORE_PASSWORD_CONFIG to envOrThrow("KAFKA_CREDSTORE_PASSWORD"),
        SslConfigs.SSL_KEY_PASSWORD_CONFIG to envOrThrow("KAFKA_CREDSTORE_PASSWORD")
    )
}


