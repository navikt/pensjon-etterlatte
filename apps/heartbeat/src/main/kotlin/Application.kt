package no.nav.etterlatte

import io.ktor.application.call
import io.ktor.http.ContentType
import io.ktor.response.respondText
import io.ktor.routing.get
import io.ktor.routing.routing
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

internal val Int.hours: Long
    get() = minutes * 60

internal val Int.minutes: Long
    get() = seconds * 60

internal val Int.seconds: Long
    get() = this * 1000L

fun List<Any>.pretty(indent: Int = 0): String =
    if (isEmpty()) "[]" else joinToString(
        ",\n${" ".repeat(indent)}",
        "[\n${" ".repeat(indent)}",
        "\n${" ".repeat(indent - 2)}]"
    )

object database {
    private val db = mutableMapOf<String, Puls>()

    fun newPuls() = UUID.randomUUID().toString().also {
        db[it] = Puls()
        GlobalScope.launch {
            delay(1.hours)
            db.remove(it)
        }
    }

    operator fun get(id: String) = db[id]
    fun pretty(): String {
        return """{
            |  "pulses": ${db.values.map { it.pretty() }.pretty(4)}
            |}""".trimMargin()
    }
}

class Puls {
    private val ts = Instant.now()
    private val beats = mutableListOf<Heartbeat>()
    fun registerHeartbeat(app: String) {
        beats.add(Heartbeat(app))
    }

    fun pretty() =
        """{
            |      "emitted": "${LocalDateTime.ofInstant(ts, ZoneId.systemDefault())}",
            |      "heartbeats": ${
            beats.map { """{ "app": "${it.app}", "lag": "${Duration.between(ts, it.ts)}" }""" }.pretty(8)
        }
            |    }""".trimMargin()

}

class Heartbeat(val app: String) {
    val ts = Instant.now()
}

fun main() {
    val env = System.getenv().toMutableMap()
    env["KAFKA_BOOTSTRAP_SERVERS"] = env["KAFKA_BROKERS"]
    env["NAV_TRUSTSTORE_PATH"] = env["KAFKA_TRUSTSTORE_PATH"]
    env["NAV_TRUSTSTORE_PASSWORD"] = env["KAFKA_CREDSTORE_PASSWORD"]
    env["KAFKA_KEYSTORE_PASSWORD"] = env["KAFKA_CREDSTORE_PASSWORD"]


    RapidApplication.Builder(RapidApplication.RapidApplicationConfig.fromEnv(env)).withKtorModule {
        routing {
            get("/") {
                call.respondText(database.pretty(), ContentType.Text.Plain)
            }
        }
    }.build()
        .apply {
            HeartbeatListener(this)
            GlobalScope.launch {
                delay(30.seconds)
                println("starter emitter")

                while (true) {
                    database.newPuls().also {
                        publish(it, pingEvent(it))
                    }
                    delay(5.minutes)
                }
            }
        }.start()
}

fun pingEvent(id: String) = JsonMessage("{}", MessageProblems("{}")).apply {
    set("@event_name", "ping")
    set("@id", id)
    set("ping_time", LocalDateTime.now())
}.toJson()

internal class HeartbeatListener(rapidsConnection: RapidsConnection) :
    River.PacketListener {

    init {
        River(rapidsConnection).apply {
            validate { it.requireValue("@event_name", "pong") }
            validate { it.requireKey("app_name", "@id") }
            validate { it.interestedIn("instance_id", "pong_time") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: RapidsConnection.MessageContext) {
        database[packet["@id"].textValue()]?.also { it.registerHeartbeat(packet["app_name"].textValue()) }
            ?: println("Heard unrequested or timed out heartbeat from ${packet["app_name"]} ")
    }
}
