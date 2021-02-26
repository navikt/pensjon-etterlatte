import io.ktor.client.*
import io.ktor.client.engine.okhttp.*
import io.ktor.client.features.auth.*
import io.ktor.client.features.auth.providers.*
import io.ktor.client.features.json.*
import no.nav.etterlatte.pdl.Pdl
import no.nav.etterlatte.sts.Sts
import no.nav.etterlatte.sts.sts
import security.token.support.ktor.clientCredential

class AppBuilder(private val props:Map<String, String>) {
    companion object{
        val CONFIG_PDL_URL = "PDL_URL"
        val CONFIG_STS_USERNAME = "STS_USERNAME"
        val CONFIG_STS_PASSWORD = "STS_PASSWORD"
    }

    fun pdlService() = Pdl(pdlhttpclient(), props[CONFIG_PDL_URL]!!)

    fun pdlhttpclient() = HttpClient(OkHttp) {
        install(JsonFeature) {serializer = JacksonSerializer() }
        install(Auth){clientCredential {}}
    }.also { Runtime.getRuntime().addShutdownHook(Thread{it.close()}) }


}