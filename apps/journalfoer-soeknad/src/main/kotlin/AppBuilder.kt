package no.nav.etterlatte

import io.ktor.client.HttpClient
import io.ktor.client.engine.okhttp.OkHttp
import io.ktor.client.features.auth.Auth
import io.ktor.client.features.json.JacksonSerializer
import io.ktor.client.features.json.JsonFeature
import no.nav.etterlatte.security.ktor.clientCredential

class AppBuilder(private val props: Map<String, String>) {
    companion object {
        val CONFIG_PDF_URL = "PDF_URL"
        val CONFIG_DOKARKIV_URL = "DOKARKIV_URL"
    }

    fun genererPdf() = PdfGenerator(pdfhttpclient(), props[CONFIG_PDF_URL]!!)
    fun journalfoerDok() = Journalfoer(jourhttpclient(), props[CONFIG_DOKARKIV_URL]!! )

    fun jourhttpclient() = HttpClient(OkHttp) {
        install(JsonFeature) { serializer = JacksonSerializer() }
        install(Auth) {
            clientCredential {
                config = System.getenv().toMutableMap().apply {
                    put("AZURE_APP_OUTBOUND_SCOPE", "api://dev-fss.etterlatte.etterlatte-proxy/.default")
                }
            }
        }
    }.also {
        Runtime.getRuntime().addShutdownHook(Thread { it.close() })
    }

    //Denne må skrives om
    fun pdfhttpclient() = HttpClient(OkHttp) {
        install(JsonFeature) { serializer = JacksonSerializer() }
        install(Auth) {
            clientCredential {
                config = System.getenv().toMutableMap().apply {
                    put("AZURE_APP_OUTBOUND_SCOPE", "api://dev-fss.etterlatte.etterlatte-proxy/.default")
                }
            }
        }
    }.also {
        Runtime.getRuntime().addShutdownHook(Thread { it.close() })
    }
}