package no.nav.etterlatte.leesah

import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import no.nav.person.pdl.leesah.Personhendelse
import org.apache.kafka.clients.consumer.KafkaConsumer
import org.slf4j.LoggerFactory
import java.net.InetAddress
import java.time.Duration
import java.util.*


interface ILivetErEnStroemAvHendelser {
    fun poll(c: (Personhendelse) -> Unit): Int
}

class LivetErEnStroemAvHendelser(env: Map<String, String>) : ILivetErEnStroemAvHendelser {
    val logger = LoggerFactory.getLogger("no.pensjon.etterlatte")

    val leesahtopic = "aapen-person-pdl-leesah-v1"
    private var consumer:KafkaConsumer<String, Personhendelse>? = null;

    init{

            GlobalScope.launch {
                logger.info("venter 30s for sidecars")
                delay(30L * 1000L)
                logger.info("starter kafka consumer")

                consumer = KafkaConsumer(
                    KafkaConfig(
                    bootstrapServers = env["LEESAH_KAFKA_BROKERS"]!!,
                    consumerGroupId =  env["LEESAH_KAFKA_GROUP_ID"]!!,
                    clientId = if (env.containsKey("NAIS_APP_NAME")) InetAddress.getLocalHost().hostName else UUID.randomUUID().toString(),
                    username = env["srvuser"],
                    password = env["srvpwd"],
                    autoCommit = env["KAFKA_AUTO_COMMIT"]?.let { "true" == it.toLowerCase()},
                    maxRecords = 20,
                    schemaRegistryUrl = env["LEESAH_KAFKA_SCHEMA_REGISTRY"]
                ).consumerConfig())
                consumer?.subscribe(listOf(leesahtopic))

                logger.info("kafka consumer startet")
                Runtime.getRuntime().addShutdownHook(Thread{ consumer?.close()})
            }

    }

    override fun poll(c:(Personhendelse)->Unit): Int {
        val meldinger = consumer?.poll(Duration.ofSeconds(5))
        meldinger?.forEach {
            c(it.value())
        }
        consumer?.commitSync()
        return meldinger?.count()?:0
    }

    fun fraStart(){
        consumer?.seekToBeginning(emptyList())
        consumer?.commitSync()
    }

}