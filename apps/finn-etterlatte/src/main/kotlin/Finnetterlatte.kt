import AppBuilder.Companion.CONFIG_PDL_URL
import AppBuilder.Companion.CONFIG_STS_PASSWORD
import AppBuilder.Companion.CONFIG_STS_URL
import AppBuilder.Companion.CONFIG_STS_USERNAME
import no.nav.helse.rapids_rivers.*

fun main() {

    val env = System.getenv().toMutableMap()
    env["KAFKA_BOOTSTRAP_SERVERS"] = env["KAFKA_BROKERS"]
    env["NAV_TRUSTSTORE_PATH"] = env["KAFKA_TRUSTSTORE_PATH"]
    env["NAV_TRUSTSTORE_PASSWORD"] = env["KAFKA_CREDSTORE_PASSWORD"]
    env["KAFKA_KEYSTORE_PASSWORD"] = env["KAFKA_CREDSTORE_PASSWORD"]
    env[CONFIG_PDL_URL] = "https://pdl-api.dev-fss.nais.io/graphql"
    env[CONFIG_STS_URL] = "https://security-token-service.dev.adeo.no/rest/v1/sts/token?grant_type=client_credentials&scope=openid"
    env[CONFIG_STS_USERNAME] = env["srvuser"]
    env[CONFIG_STS_PASSWORD] = env["srvpwd"]

    RapidApplication.create(env).apply {
        MyCoolApp(this, AppBuilder(env).pdlService())


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


        pdl.finnEtterlatteForPerson().forEach{
            context.send(JsonMessage("{}", MessageProblems("{}")).apply {
                set("ident", it)
            }.toJson())
        }

        // nested objects can be chained using "."
        // println(packet["nested.key"].asText())
    }
}

interface FinnEtterlatteForPerson{
    fun finnEtterlatteForPerson():List<String>
}
