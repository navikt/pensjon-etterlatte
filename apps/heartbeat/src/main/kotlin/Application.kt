package no.nav.etterlatte

import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.RapidApplication
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River
import java.time.Duration
import java.time.Instant
import java.util.*
import kotlin.collections.set


internal val Int.hours: Long
    get() = minutes * 60

internal val Int.minutes: Long
    get() = seconds * 60

internal val Int.seconds: Long
    get() = this * 1000L


object database {
    private val db = mutableMapOf<String, Instant>()

    fun new() = UUID.randomUUID().toString().also {
        db[it] = Instant.now()
        GlobalScope.launch {
            delay(1.hours)
            db.remove(it)
        }
    }

    operator fun get(id: String) = db[id]?.let { Duration.between(it, Instant.now()) }
}

fun main() {

    val env = System.getenv().toMutableMap()
    env["KAFKA_BOOTSTRAP_SERVERS"] = env["KAFKA_BROKERS"]
    env["NAV_TRUSTSTORE_PATH"] = env["KAFKA_TRUSTSTORE_PATH"]
    env["NAV_TRUSTSTORE_PASSWORD"] = env["KAFKA_CREDSTORE_PASSWORD"]
    env["KAFKA_KEYSTORE_PASSWORD"] = env["KAFKA_CREDSTORE_PASSWORD"]


    Emitter()
    RapidApplication.create(env).apply {
        HeartbeatListener(this)
        Heart(this)
    }.start()

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
        println(database[packet["@id"].textValue()]?.let { "App ${packet["@app"]} lagging by $it" }
            ?: "Heard unrequested or timed out heartbeat from ${packet["@app"]} ")
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


