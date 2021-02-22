import io.ktor.client.*
import io.ktor.client.engine.okhttp.*
import io.ktor.client.features.auth.*
import io.ktor.client.features.auth.providers.*
import io.ktor.client.features.json.*
import no.nav.etterlatte.pdl.Pdl
import no.nav.etterlatte.sts.Sts
import no.nav.etterlatte.sts.sts

class AppBuilder(private val props:Map<String, String>) {
    companion object{
        val CONFIG_PDL_URL = "PDL_URL"
        val CONFIG_STS_URL = "STS_URL"
        val CONFIG_STS_USERNAME = "STS_USERNAME"
        val CONFIG_STS_PASSWORD = "STS_PASSWORD"
    }

    fun pdlService() = Pdl(pdlhttpclient(), props[CONFIG_PDL_URL]!!)
    fun stsService() = Sts(stshttpclient(), props[CONFIG_STS_URL]!!)

    fun pdlhttpclient() = HttpClient(OkHttp) {
        install(JsonFeature) {serializer = JacksonSerializer() }
        install(Auth){sts {stsClient = stsService()}}
    }.also { Runtime.getRuntime().addShutdownHook(Thread{it.close()}) }

    fun stshttpclient() = HttpClient(OkHttp) {
        install(JsonFeature) { serializer = JacksonSerializer() }
        install(Auth) {
            basic {
                username = props[CONFIG_STS_USERNAME]!!
                password = props[CONFIG_STS_PASSWORD]!!
                sendWithoutRequest = true
            }
        }
    }.also { Runtime.getRuntime().addShutdownHook(Thread{it.close()}) }

}