package no.nav.etterlatte

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.ktor.client.HttpClient
import io.ktor.client.engine.mock.MockEngine
import io.ktor.client.engine.mock.respond
import io.ktor.client.features.json.JacksonSerializer
import io.ktor.client.features.json.JsonFeature
import io.ktor.content.TextContent
import io.ktor.http.ContentType
import io.ktor.http.fullPath
import io.ktor.http.headersOf
import kotlinx.coroutines.runBlocking
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageProblems
import no.nav.helse.rapids_rivers.testsupport.TestRapid
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.nio.file.Paths
import java.util.*


class JournalfoerSoeknadTest {

    var pdf = Paths.get("pdf.pdf").toFile().readBytes()

    val dok: List<JournalpostDokument> = listOf(
        JournalpostDokument(
            tittel = "test",
            dokumentKategori = DokumentKategori.IB,
            dokumentvarianter = listOf(
                DokumentVariant.ArkivPDF(fysiskDokument = Base64.getEncoder().encodeToString(pdf)),
                DokumentVariant.OriginalJson(
                    fysiskDokument = Base64.getEncoder().encodeToString(pdf),
                )
            )
        )
    )

    @Test
    fun journalfoer() {

        val jorp =JournalpostRequest(
            tittel = "tittel",
            journalpostType = JournalPostType.INNGAAENDE,
            tema = "tema",
            kanal = "brev",
            behandlingstema = "PEN",
            journalfoerendeEnhet = "Pensjon Oslo",
            avsenderMottaker = AvsenderMottaker(
                id = "id",
                navn = "navn",
                idType = "FNR"
            ),
            bruker = Bruker(
                id = "id",
                idType = "FNR"
            ),

            sak = Fagsak(
                fagsakId = "id",
                fagsaksystem = "BP",
                sakstype = "soknad"
            ),
            dokumenter = dok
        )

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
        message["@journalpost"] = jorp

        val inspector = TestRapid()
            .apply { JournalfoerSoeknad(this, genererPdfMock(), journalfoerDokMock()) }
            .apply {
                sendTestMessage(
                    message.toJson()
                )
            }.inspektør

        //HER MÅ JEG ASSERTE NOE; MEN inspector.message er ikke satt
        //assertEquals("456", )//   .message(0).get("@journalpostId") )

    }





    @Test
    fun testPdfGen() {

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
        val httpClient = HttpClient(MockEngine) {
            engine {
                addHandler { request ->
                    when (request.url.fullPath) {
                        "/api/v1/genpdf/eypdfgen/soknad" -> {
                            val req = jacksonObjectMapper().readTree((request.body as TextContent).text)
                                assertEquals(message["@skjema_info"], req)
                            val responseHeaders =
                                headersOf("Content-Type" to listOf(ContentType.Application.Pdf.toString()))
                            respond(
                                "Dette er en veldig spennende PDF".toByteArray(),
                                headers = responseHeaders
                            )
                        }
                        else -> error("Unhandled ${request.url.fullPath}")
                    }
                }
            }
            install(JsonFeature) { serializer = JacksonSerializer() }
        }

        runBlocking {
            PdfGenerator(httpClient, "https://ey-pdfgen/api/v1/genpdf/eypdfgen").genererPdf(
                message["@skjema_info"],
                "soknad"
            ).also {
                Paths.get("pdf.pdf").toFile().writeBytes(it)
                assertEquals(String(it),"Dette er en veldig spennende PDF")
            }
        }
    }

}


class journalfoerDokMock : JournalfoerDok {
    override suspend fun journalfoerDok(dokumentInnhold: JsonMessage, pdf: ByteArray): String {
        return "1234"
    }
}

class genererPdfMock : GenererPdf {
    override suspend fun genererPdf(input: JsonNode, template: String): ByteArray {
        return Paths.get("pdf.pdf").toFile().readBytes()
    }
}







