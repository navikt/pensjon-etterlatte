package no.nav.etterlatte

import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageProblems
import no.nav.helse.rapids_rivers.RapidApplication
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River
import java.util.*
import kotlin.collections.set

fun main() {

    val env = System.getenv().toMutableMap()
    env["KAFKA_BOOTSTRAP_SERVERS"] = env["KAFKA_BROKERS"]
    env["NAV_TRUSTSTORE_PATH"] = env["KAFKA_TRUSTSTORE_PATH"]
    env["NAV_TRUSTSTORE_PASSWORD"] = env["KAFKA_CREDSTORE_PASSWORD"]
    env["KAFKA_KEYSTORE_PASSWORD"] = env["KAFKA_CREDSTORE_PASSWORD"]



    RapidApplication.create(env).apply {
        HeartbeatListener(this)
        Heart(this)
        PulsEmitter(this)
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

internal class PulsEmitter(val rapidsConnection: RapidsConnection) {
    init {
        GlobalScope.launch {
            println("starter emitter")
            while (true) {

                delay(60000L)

                val id = UUID.randomUUID().toString()

                println("Sender puls")
                rapidsConnection.publish(JsonMessage("{}", MessageProblems("{}")).apply {
                    set("@behov", "heartbeat")
                    set("@id", id)
                }.toJson())
            }
        }

    }
}
