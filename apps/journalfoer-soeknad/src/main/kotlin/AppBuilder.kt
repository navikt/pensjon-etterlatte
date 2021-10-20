package no.nav.etterlatte

import io.ktor.client.HttpClient
import io.ktor.client.engine.okhttp.OkHttp
import io.ktor.client.features.auth.Auth
import io.ktor.client.features.json.JacksonSerializer
import io.ktor.client.features.json.JsonFeature
import no.nav.etterlatte.security.ktor.clientCredential

class AppBuilder(private val props: Map<String, String>) {
    companion object {
        private const val CONFIG_PDF_URL = "PDF_URL"
        private const val CONFIG_DOKARKIV_URL = "DOKARKIV_URL"
        private const val CONFIG_AZURE_DOKARKIV_SCOPE = "AZURE_DOKARKIV_SCOPE"
    }

    fun genererPdf() = PdfGenerator(pdfhttpclient(), props[CONFIG_PDF_URL]!!)
    fun journalfoerDok() = JournalfoeringService(opprettJournalfoeringKlient())

    private fun opprettJournalfoeringKlient() = HttpClient(OkHttp) {
        install(JsonFeature) { serializer = JacksonSerializer() }
        install(Auth) {
            clientCredential {
                config = System.getenv().toMutableMap().apply {
                    put("AZURE_APP_OUTBOUND_SCOPE", "api://dev-fss.etterlatte.etterlatte-proxy/.default")
                    // put("AZURE_APP_OUTBOUND_SCOPE", props[CONFIG_AZURE_DOKARKIV_SCOPE])
                }
            }
        }
    }.also {
        Runtime.getRuntime().addShutdownHook(Thread { it.close() })
    }.let {
        DokarkivKlient(it, props[CONFIG_DOKARKIV_URL]!!)
    }

    private fun pdfhttpclient() = HttpClient(OkHttp) {
        install(JsonFeature) { serializer = JacksonSerializer() }

    }.also {
        Runtime.getRuntime().addShutdownHook(Thread { it.close() })
    }
}