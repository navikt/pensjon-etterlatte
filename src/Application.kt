package no.pensjon

import io.ktor.application.*
import io.ktor.response.*
import io.ktor.request.*
import io.ktor.routing.*
import io.ktor.http.*
import com.fasterxml.jackson.databind.*
import io.ktor.jackson.*
import io.ktor.features.*
import org.apache.kafka.clients.consumer.KafkaConsumer
import org.apache.kafka.common.serialization.ByteArrayDeserializer
import java.net.InetAddress
import java.time.Duration
import java.util.*

fun main(args: Array<String>): Unit = io.ktor.server.netty.EngineMain.main(args)

@Suppress("unused") // Referenced in application.conf
@kotlin.jvm.JvmOverloads
fun Application.module(testing: Boolean = false) {
    install(ContentNegotiation) {
        jackson {
            enable(SerializationFeature.INDENT_OUTPUT)
        }
    }
    val env = System.getenv()
    val kafkaConfig = KafkaConfig(
        bootstrapServers = "b27apvl00045.preprod.local:8443,b27apvl00046.preprod.local:8443,b27apvl00047.preprod.local:8443",
        consumerGroupId = "etterlatte-v1",
        clientId = if (env.containsKey("NAIS_APP_NAME")) InetAddress.getLocalHost().hostName else UUID.randomUUID().toString(),
        username = env.get("srvuser"),
        password = env.get("srvpwd"),
        //truststore = env["NAV_TRUSTSTORE_PATH"],
        //truststorePassword = env["NAV_TRUSTSTORE_PASSWORD"],
        autoCommit = env["KAFKA_AUTO_COMMIT"]?.let { "true" == it.toLowerCase() }
    )



    routing {
        get("/") {
            call.respondText("Environment: " + System.getenv().keys.joinToString(","), contentType = ContentType.Text.Plain)
        }
        get("/kafka") {
            val consumer = KafkaConsumer(kafkaConfig.consumerConfig(), ByteArrayDeserializer(), ByteArrayDeserializer())
            consumer.subscribe(listOf("aapen-person-pdl-leesah-v1"))
            val antallMeldingerLest = consumer.poll(Duration.ofSeconds(60)).count()
            consumer.close()
            call.respondText("har lest $antallMeldingerLest meldinger", contentType = ContentType.Text.Plain)
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

