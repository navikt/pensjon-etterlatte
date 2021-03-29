package no.nav.etterlatte

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.apache.kafka.clients.CommonClientConfigs
import org.apache.kafka.clients.producer.KafkaProducer
import org.apache.kafka.clients.producer.Producer
import org.apache.kafka.clients.producer.ProducerConfig
import org.apache.kafka.clients.producer.ProducerRecord
import org.apache.kafka.common.config.SslConfigs
import org.apache.kafka.common.security.auth.SecurityProtocol
import java.net.InetAddress
import java.util.*

class KafkaRapid(private val producer: Producer<String, String>, private val topic: String) : Rapid {
    companion object {
        private val javaKeystore: String = "jks"
        private val pkcs12: String = "PKCS12"
        fun fromEnv(env: Map<String, String>): KafkaRapid {
            return Properties().apply {

                put(CommonClientConfigs.BOOTSTRAP_SERVERS_CONFIG, env.getValue("KAFKA_BROKERS"))
                put(CommonClientConfigs.SECURITY_PROTOCOL_CONFIG, SecurityProtocol.SSL.name)
                put(SslConfigs.SSL_ENDPOINT_IDENTIFICATION_ALGORITHM_CONFIG, "")
                put(SslConfigs.SSL_TRUSTSTORE_TYPE_CONFIG, javaKeystore)
                put(SslConfigs.SSL_KEYSTORE_TYPE_CONFIG, pkcs12)
                put(SslConfigs.SSL_TRUSTSTORE_LOCATION_CONFIG, env["KAFKA_TRUSTSTORE_PATH"])
                put(SslConfigs.SSL_TRUSTSTORE_PASSWORD_CONFIG, env.getValue("KAFKA_CREDSTORE_PASSWORD"))
                put(SslConfigs.SSL_KEYSTORE_LOCATION_CONFIG, env.getValue("KAFKA_KEYSTORE_PATH"))
                put(SslConfigs.SSL_KEYSTORE_PASSWORD_CONFIG, env.getValue("KAFKA_CREDSTORE_PASSWORD"))
                put(ProducerConfig.CLIENT_ID_CONFIG, "producer-${InetAddress.getLocalHost().hostName}")
                put(ProducerConfig.ACKS_CONFIG, "1")
                put(ProducerConfig.LINGER_MS_CONFIG, "0")
                put(ProducerConfig.MAX_IN_FLIGHT_REQUESTS_PER_CONNECTION, "1")
            }.let {
                KafkaRapid(KafkaProducer(it), env["KAFKA_RAPID_TOPIC"]!!)
            }

        }
    }


    override suspend fun publish(message: String): Job {
        val f = producer.send(ProducerRecord(topic, UUID.randomUUID().toString(), message))
        return withContext(Dispatchers.IO) {
            launch { f.get() }
        }
    }
}