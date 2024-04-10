package no.nav.etterlatte

import io.ktor.client.HttpClient
import io.ktor.client.engine.okhttp.OkHttp
import io.ktor.client.plugins.auth.Auth
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.serialization.jackson.jackson
import no.nav.etterlatte.libs.pdl.AdressebeskyttelseKlient
import no.nav.etterlatte.security.ktor.clientCredential

class AppBuilder(private val props: Map<String, String>) {
    companion object {
        const val CONFIG_PDL_URL = "PDL_URL"
    }

    fun createAdressebeskyttelseService(): AdressebeskyttelseService {
        val adressebeskyttelseKlient = AdressebeskyttelseKlient(pdlHttpClient(), props[CONFIG_PDL_URL]!!)

        return AdressebeskyttelseService(adressebeskyttelseKlient)
    }

    private fun pdlHttpClient() = HttpClient(OkHttp) {
        install(ContentNegotiation) { jackson() }
        install(Auth) {
            clientCredential {
                config = props.toMutableMap()
                    .apply { put("AZURE_APP_OUTBOUND_SCOPE", requireNotNull(get("PDL_AZURE_SCOPE"))) }
            }
        }
    }.also { Runtime.getRuntime().addShutdownHook(Thread { it.close() }) }

}
