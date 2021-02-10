package no.pensjon

import io.ktor.application.*
import io.ktor.response.*
import io.ktor.request.*
import io.ktor.routing.*
import io.ktor.http.*
import com.fasterxml.jackson.databind.*
import io.ktor.jackson.*
import io.ktor.features.*
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import org.apache.kafka.clients.consumer.KafkaConsumer
import org.apache.kafka.common.serialization.ByteArrayDeserializer
import org.slf4j.LoggerFactory
import org.slf4j.event.Level
import java.net.InetAddress
import java.time.Duration
import java.util.*

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)


val leesahtopic = "aapen-person-pdl-leesah-v1"
var consumer:KafkaConsumer<ByteArray, ByteArray>? = null;

@Suppress("unused") // Referenced in application.conf
@kotlin.jvm.JvmOverloads
fun Application.module(testing: Boolean = false) {


    GlobalScope.launch {
        val logger = LoggerFactory.getLogger("no.pensjon.etterlatte")
        logger.info("venter 30s for sidcars")
        delay(30L * 1000L)
        logger.info("startr kafka consumer")

        val env = System.getenv()
        val kafkaConfig = KafkaConfig(
            bootstrapServers = "b27apvl00045.preprod.local:8443,b27apvl00046.preprod.local:8443,b27apvl00047.preprod.local:8443",
            consumerGroupId = "etterlatte-v1",
            clientId = if (env.containsKey("NAIS_APP_NAME")) InetAddress.getLocalHost().hostName else UUID.randomUUID().toString(),
            username = env.get("srvuser"),
            password = env.get("srvpwd"),
            autoCommit = env["KAFKA_AUTO_COMMIT"]?.let { "true" == it.toLowerCase()},
            maxRecords = 1

        )
        logger.info("startr kafka consumer")

        consumer = KafkaConsumer(kafkaConfig.consumerConfig(), ByteArrayDeserializer(), ByteArrayDeserializer())
        consumer?.subscribe(listOf(leesahtopic))
        logger.info("kafka consumer startet")

        Runtime.getRuntime().addShutdownHook(Thread{ consumer?.close()})
    }

    install(ContentNegotiation) {
        jackson {
            enable(SerializationFeature.INDENT_OUTPUT)
        }
    }
    install(CallLogging) {
        level = Level.INFO
    }


    routing {
        get("/") {
            call.respondText("Environment: " + System.getenv().keys.joinToString(","), contentType = ContentType.Text.Plain)
        }

        get("/kafka") {
            val meldinger = consumer?.poll(Duration.ofSeconds(5))
            val antallMeldingerLest = meldinger?.count()
            if(meldinger?.isEmpty != false){
                call.respondText("Ingen nye meldinger", contentType = ContentType.Text.Plain)
            }else{
                val melding = meldinger.firstOrNull()
                val partition = melding?.partition()
                val offset = melding?.offset()

                call.respondText("Leste $antallMeldingerLest. Melding kommer fra offset $offset på partisjon $partition", contentType = ContentType.Text.Plain)
            }
            consumer?.commitSync()
        }
        get("/fromstart") {
            consumer?.seekToBeginning(emptyList())
            consumer?.commitSync()
            call.respondText("partition has been set to start", contentType = ContentType.Text.Plain)
        }

        get("/isAlive") {
            call.respondText("JADDA!", contentType = ContentType.Text.Plain)
        }
        get("/isReady") {
            call.respondText("JADDA!", contentType = ContentType.Text.Plain)
        }

        get("/json/jackson") {
            call.respond(mapOf("hello" to "world"))
        }
    }
}

