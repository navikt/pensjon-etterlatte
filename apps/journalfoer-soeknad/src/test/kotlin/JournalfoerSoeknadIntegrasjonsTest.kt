package no.nav.etterlatte

import io.ktor.client.HttpClient
import io.ktor.client.engine.okhttp.OkHttp
import io.ktor.client.features.json.JacksonSerializer
import io.ktor.client.features.json.JsonFeature
import kotlinx.coroutines.runBlocking
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageProblems
import org.junit.jupiter.api.Assertions.assertEquals
import java.nio.file.Paths


class JournalfoerSoeknadIntegrasjonsTestTest {

    //Krever at man kjører opp run_development i ey-pdfgen!
    //Test
    fun integrasjonstestPDFGen() {

        val message = JsonMessage(
            """{"@skjema_info":{
        "søknadInnhold": {
            "forNav": {
                "saksnummer": 123,
                "søknadsId": 321,
                "søknadOpprettet": "En eller annen gang"
            },
            "personopplysninger": {
                "navn": {
                    "fornavn": "Dolly",
                    "mellomnavn": "D.",
                    "etternavn": "Duck"
                }
            }
        }
    }}""", MessageProblems("{}")
        )
        message.interestedIn("@skjema_info")

        val httpClient = HttpClient(OkHttp) {
            install(JsonFeature) { serializer = JacksonSerializer() }
        }

        runBlocking {
            PdfGenerator(httpClient, "http://0.0.0.0:8081/api/v1/genpdf/eypdfgen").genererPdf(
                message["@skjema_info"],
                "soeknad"
            ).also {
                Paths.get("pdf.pdf").toFile().writeBytes(it)
                assertEquals(String(it).substring(0, 8), "%PDF-1.4")
            }
        }
    }
}









