import io.ktor.client.*
import io.ktor.client.engine.okhttp.*
import io.ktor.client.features.auth.*
import io.ktor.client.features.json.*
import no.nav.etterlatte.pdl.Pdl
import no.nav.etterlatte.security.ktor.clientCredential

class AppBuilder(private val props:Map<String, String>) {
    companion object{
        val CONFIG_PDL_URL = "PDL_URL"
    }

    fun pdlService() = Pdl(pdlhttpclient(), props[CONFIG_PDL_URL]!!)

    fun pdlhttpclient() = HttpClient(OkHttp) {
        install(JsonFeature) {serializer = JacksonSerializer() }
        install(Auth){clientCredential {config = System.getenv().toMutableMap()
            .apply { put("AZURE_APP_OUTBOUND_SCOPE", "api://dev-fss.etterlatte.etterlatte-proxy/.default") }
        }
        }
    }.also { Runtime.getRuntime().addShutdownHook(Thread{it.close()}) }


}