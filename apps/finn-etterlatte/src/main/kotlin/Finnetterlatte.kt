import kotlinx.coroutines.runBlocking
import no.nav.helse.rapids_rivers.*

fun main() {

    val env = System.getenv().toMutableMap()
    env["KAFKA_BOOTSTRAP_SERVERS"] = env["KAFKA_BROKERS"]
    env["NAV_TRUSTSTORE_PATH"] = env["KAFKA_TRUSTSTORE_PATH"]
    env["NAV_TRUSTSTORE_PASSWORD"] = env["KAFKA_CREDSTORE_PASSWORD"]
    env["KAFKA_KEYSTORE_PASSWORD"] = env["KAFKA_CREDSTORE_PASSWORD"]

    RapidApplication.create(env).apply {
        MyCoolApp(this, AppBuilder(env).pdlService())
        Monitor(this)

    }.start()
}


internal class MyCoolApp(rapidsConnection: RapidsConnection, val pdl:FinnEtterlatteForPerson) : River.PacketListener {

    init {
        River(rapidsConnection).apply {
            validate { it.demandValue("@event_name", "person_dod") }
            validate { it.requireKey("@ident") }
        }.register(this)
    }

    override fun onError(problems: MessageProblems, context: RapidsConnection.MessageContext) {
        /* fordi vi bruker demandValue() på event_name kan vi trygt anta at meldingen
           er "my_event", og at det er minst én av de ulike require*() som har feilet */
    }

    override fun onPacket(packet: JsonMessage, context: RapidsConnection.MessageContext) {
        println(packet["@ident"].asText())


        runBlocking {
            pdl.finnEtterlatteForPerson(packet["@ident"].asText()).forEach{
                context.send(JsonMessage("{}", MessageProblems("{}")).apply {
                    set("@ident", it)
                    set("@Ident_avdod", packet["@ident"])
                    set("@event_name", "etterlatt_barn_identifisert")
                }.toJson())
            }
        }
        // nested objects can be chained using "."
        // println(packet["nested.key"].asText())
    }
}


internal class Monitor(rapidsConnection: RapidsConnection) : River.PacketListener {

    init {
        River(rapidsConnection).apply {
            validate { it.demandValue("@event_name", "etterlatt_barn_identifisert") }
        }.register(this)
    }

    override fun onError(problems: MessageProblems, context: RapidsConnection.MessageContext) {
    }

    override fun onPacket(packet: JsonMessage, context: RapidsConnection.MessageContext) {
        println(packet.toJson())
    }
}

interface FinnEtterlatteForPerson{
    suspend fun finnEtterlatteForPerson(forelder: String):List<String>
}
