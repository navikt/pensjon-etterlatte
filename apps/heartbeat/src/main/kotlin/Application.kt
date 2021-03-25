package no.nav.etterlatte

import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.ktor.application.call
import io.ktor.http.ContentType
import io.ktor.response.respondText
import io.ktor.routing.get
import io.ktor.routing.routing
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageContext
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

val json = jacksonObjectMapper()
    .registerModule(JavaTimeModule())
    .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
    .writerWithDefaultPrettyPrinter()

internal val Int.hours: Long
    get() = minutes * 60

internal val Int.minutes: Long
    get() = seconds * 60

internal val Int.seconds: Long
    get() = this * 1000L

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
    fun data() = mapOf<String, Any>("pulses" to db.values.map { it.data() })
}

class Puls {
    private val ts = Instant.now()
    private val beats = mutableListOf<Heartbeat>()
    fun registerHeartbeat(app: String) {
        beats.add(Heartbeat(app))
    }

    fun data() = mapOf(
        "emitted" to LocalDateTime.ofInstant(ts, ZoneId.systemDefault()),
        "heartbeats" to beats.map {
            mapOf(
                "app" to it.app,
                "lag" to Duration.between(ts, it.ts)
            )
        }
    )
}

class Heartbeat(val app: String) {
    val ts = Instant.now()
}

fun main() {
    RapidApplication.Builder(RapidApplication.RapidApplicationConfig.fromEnv(System.getenv())).withKtorModule {
        routing {
            get("/") {
                call.respondText(json.writeValueAsString(database.data()), ContentType.Text.Plain)
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

    override fun onPacket(packet: JsonMessage, context: MessageContext) {
        database[packet["@id"].textValue()]?.also { it.registerHeartbeat(packet["app_name"].textValue()) }
            ?: println("Heard unrequested or timed out heartbeat from ${packet["app_name"]} ")
    }
}
