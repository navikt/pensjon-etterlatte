package no.nav.etterlatte

import AppBuilder
import FinnEtterlatte
import Monitor
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageProblems
import no.nav.helse.rapids_rivers.RapidApplication
import no.nav.helse.rapids_rivers.RapidsConnection
import no.nav.helse.rapids_rivers.River
import org.slf4j.LoggerFactory

fun main() {

    val env = System.getenv().toMutableMap()
    env["KAFKA_BOOTSTRAP_SERVERS"] = env["KAFKA_BROKERS"]
    env["NAV_TRUSTSTORE_PATH"] = env["KAFKA_TRUSTSTORE_PATH"]
    env["NAV_TRUSTSTORE_PASSWORD"] = env["KAFKA_CREDSTORE_PASSWORD"]
    env["KAFKA_KEYSTORE_PASSWORD"] = env["KAFKA_CREDSTORE_PASSWORD"]

    RapidApplication.create(env).apply {
        FinnEtterlatte(this, AppBuilder(env).pdlService())
        Monitor(this)
        Heart(this)
    }.start()
}

internal class Heart(rapidsConnection: RapidsConnection) :
    River.PacketListener {
    private val log = LoggerFactory.getLogger(Heart::class.java)

    init {
        River(rapidsConnection).apply {
            validate { it.demandValue("@behov", "heartbeat") }
            validate { it.rejectKey("@app") }
        }.register(this)
    }

    override fun onPacket(packet: JsonMessage, context: RapidsConnection.MessageContext) {
        log.info("Accepted ${packet.toJson()}")
        packet["@app"] = System.getenv("NAIS_APP_NAME")
        context.send(packet.toJson())
    }

    override fun onError(problems: MessageProblems, context: RapidsConnection.MessageContext) {
        log.info("Error: $problems")
    }

    override fun onSevere(error: MessageProblems.MessageException, context: RapidsConnection.MessageContext) {
        log.info("Severe: $error")
    }
}