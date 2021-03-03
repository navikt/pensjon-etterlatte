package no.nav.etterlatte

import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageProblems
import no.nav.helse.rapids_rivers.RapidApplication
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River
import java.time.Duration
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId
import java.util.*
import kotlin.collections.set
import kotlin.time.ExperimentalTime
import kotlin.time.minutes

object database {
    private val db = mutableMapOf<String, HeartBeats>()
    operator fun get(id: String) = db[id]
    operator fun set(id: String, app: String) {
        db[id]?.registerAnswer(app)
    }

    operator fun plusAssign(id: String) {
        db[id] = HeartBeats()
    }

    override fun toString(): String {
        return "data: {${db.values}}"
    }
}


@ExperimentalTime
fun main() {

    val env = System.getenv().toMutableMap()
    env["KAFKA_BOOTSTRAP_SERVERS"] = env["KAFKA_BROKERS"]
    env["NAV_TRUSTSTORE_PATH"] = env["KAFKA_TRUSTSTORE_PATH"]
    env["NAV_TRUSTSTORE_PASSWORD"] = env["KAFKA_CREDSTORE_PASSWORD"]
    env["KAFKA_KEYSTORE_PASSWORD"] = env["KAFKA_CREDSTORE_PASSWORD"]



    RapidApplication.create(env).apply {
        HeartbeatListener(this)
        Heart(this)
        start()
        PulsEmitter(this)
    }
}


internal class HeartbeatListener(rapidsConnection: RapidsConnection) :
    River.PacketListener {

    init {
        River(rapidsConnection).apply {
            validate { it.demandValue("@behov", "heartbeat") }
            validate { it.requireKey("@app", "@id") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: RapidsConnection.MessageContext) {
        database[packet["@id"].textValue()] = packet["@app"].textValue()
        println(packet.toJson())
    }
}

internal class Heart(rapidsConnection: RapidsConnection) :
    River.PacketListener {

    init {
        River(rapidsConnection).apply {
            validate { it.demandValue("@behov", "heartbeat") }
            validate { it.rejectKey("@app") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: RapidsConnection.MessageContext) {
        packet["@app"] = System.getenv("NAIS_APP_NAME")
        context.send(packet.toJson())
    }
}

@ExperimentalTime
internal class PulsEmitter(val rapidsConnection: RapidsConnection) {
    init {
        GlobalScope.launch {
            var running = true
            Runtime.getRuntime().addShutdownHook(Thread { running = false })

            while (running) {
                delay(1.5.minutes)

                val id = UUID.randomUUID().toString()
                database += id

                rapidsConnection.publish(JsonMessage("{}", MessageProblems("{}")).apply {
                    set("@behov", "heartbeat")
                    set("@id", id)
                }.toJson())
            }
        }

    }
}

class HeartBeats {
    val created = Instant.now()
    val answers = mutableListOf<HeartBeat>()

    fun registerAnswer(app: String) {
        answers.add(HeartBeat(app, created))
    }


    override fun toString(): String {
        return """{
          | created: ${LocalDateTime.ofInstant(created, ZoneId.systemDefault())}, 
          | answers: $answers
          |}
        """.trimMargin()
    }
}

class HeartBeat(val app: String, offset: Instant) {
    val lag = Duration.between(offset, Instant.now())

    override fun toString(): String {
        return """  {
          |    lagg: ${lag}, 
          |    app: $app
          |  }
        """.trimMargin()
    }
}
