package no.pensjon

import java.lang.IllegalArgumentException
import java.net.InetAddress
import java.util.*




sealed class AppConfig(val enableKafka:Boolean) {
    abstract fun kafka(): KafkaConfig
}



class TestConfig: AppConfig(false) {
    override fun kafka(): KafkaConfig = throw IllegalArgumentException()
}

class DevConfig: AppConfig(true) {


    override fun kafka():KafkaConfig {
        val env = System.getenv()
        return KafkaConfig(
            bootstrapServers = "b27apvl00045.preprod.local:8443,b27apvl00046.preprod.local:8443,b27apvl00047.preprod.local:8443",
            consumerGroupId =  "etterlatte-v1",
            clientId = if (env.containsKey("NAIS_APP_NAME")) InetAddress.getLocalHost().hostName else UUID.randomUUID().toString(),
            username = env["srvuser"],
            password = env["srvpwd"],
            autoCommit = env["KAFKA_AUTO_COMMIT"]?.let { "true" == it.toLowerCase()},
            maxRecords = 1,
            schemaRegistryUrl = "https://kafka-schema-registry.nais-q.adeo.no/"
        )
    }
}


