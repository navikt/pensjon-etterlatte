package no.nav.etterlatte

import dokarkiv.DokarkivKlient
import io.ktor.client.HttpClient
import io.ktor.client.engine.okhttp.OkHttp
import io.ktor.client.plugins.auth.Auth
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.serialization.jackson.jackson
import no.nav.etterlatte.pdf.DokumentService
import no.nav.etterlatte.security.ktor.clientCredential
import pdf.PdfGeneratorKlient

class AppBuilder(private val props: Map<String, String>) {
    companion object {
        private const val CONFIG_PDF_URL = "PDF_URL"
        private const val CONFIG_DOKARKIV_URL = "DOKARKIV_URL"
        private const val CONFIG_AZURE_DOKARKIV_SCOPE = "AZURE_DOKARKIV_SCOPE"
    }

    fun pdfService() = DokumentService(PdfGeneratorKlient(pdfhttpclient(), props[CONFIG_PDF_URL]!!))
    fun journalfoerDok() = JournalfoeringService(opprettJournalfoeringKlient())

    private fun opprettJournalfoeringKlient() = HttpClient(OkHttp) {
        install(ContentNegotiation) { jackson() }
        install(Auth) {
            clientCredential {
                config = System.getenv().toMutableMap().apply {
                    put("AZURE_APP_OUTBOUND_SCOPE", props[CONFIG_AZURE_DOKARKIV_SCOPE])
                }
            }
        }
    }.also {
        Runtime.getRuntime().addShutdownHook(Thread { it.close() })
    }.let {
        DokarkivKlient(it, props[CONFIG_DOKARKIV_URL]!!)
    }

    private fun pdfhttpclient() = HttpClient(OkHttp) {
        install(ContentNegotiation) { jackson() }

    }.also {
        Runtime.getRuntime().addShutdownHook(Thread { it.close() })
    }
}