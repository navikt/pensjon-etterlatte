package no.pensjon.etterlatte
import org.apache.kafka.clients.producer.KafkaProducer
import org.apache.kafka.clients.producer.ProducerRecord
import org.slf4j.LoggerFactory
import java.util.*

interface IDodsmeldinger {
    fun personErDod(ident: String)
}

class Dodsmeldinger(config:AppConfig) : IDodsmeldinger {

    val producer = KafkaProducer<String, String>(config.producerConfig())
    val logger = LoggerFactory.getLogger(this.javaClass)

    init {
        Runtime.getRuntime().addShutdownHook(Thread{ producer?.close()})

    }

    override fun personErDod(ident:String){
        logger.info("Poster at person $ident er død")
        producer.send(ProducerRecord("etterlatte.dodsmelding", UUID.randomUUID().toString(),  JsonMessage("{}", MessageProblems("{}"))
            .apply {
                set("eventtype", "person_dod")
                set("ident", ident)
            }
            .toJson()))
    }

}