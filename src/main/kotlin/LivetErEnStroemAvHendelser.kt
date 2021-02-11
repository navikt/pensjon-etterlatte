package no.pensjon

import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import no.nav.person.pdl.leesah.Personhendelse
import org.apache.kafka.clients.consumer.KafkaConsumer
import org.slf4j.LoggerFactory
import java.time.Duration


class LivetErEnStroemAvHendelser(config: AppConfig) {
    val logger = LoggerFactory.getLogger("no.pensjon.etterlatte")

    val leesahtopic = "aapen-person-pdl-leesah-v1"
    private var consumer:KafkaConsumer<String, Personhendelse>? = null;

    init{
        if(config.enableKafka){
            GlobalScope.launch {
                logger.info("venter 30s for sidecars")
                delay(30L * 1000L)
                logger.info("starter kafka consumer")

                consumer = KafkaConsumer(config.kafka().consumerConfig())
                consumer?.subscribe(listOf(leesahtopic))

                logger.info("kafka consumer startet")
                Runtime.getRuntime().addShutdownHook(Thread{ consumer?.close()})
            }

        } else {
            logger.info("kafka er deaktivert")

        }

    }

    fun poll(c:(Personhendelse)->Unit): Int {
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