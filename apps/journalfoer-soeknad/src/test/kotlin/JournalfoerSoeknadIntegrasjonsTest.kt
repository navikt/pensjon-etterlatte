package no.nav.etterlatte

import io.ktor.client.HttpClient
import io.ktor.client.engine.okhttp.OkHttp
import io.ktor.client.features.json.JacksonSerializer
import io.ktor.client.features.json.JsonFeature
import kotlinx.coroutines.runBlocking
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageProblems
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.nio.file.Paths


class JournalfoerSoeknadIntegrasjonsTestTest {

    //Krever at man kjører opp run_development iey-pdfgen!
    @Test
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
                "soknad"
            ).also {
                Paths.get("pdf.pdf").toFile().writeBytes(it)
                assertEquals(String(it).substring(0, 8), "%PDF-1.4")
            }

            assertEquals(1, 1)
        }

    }
    /*val jorp =JournalpostRequest(
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
    dokumenter =
    )
}

*/
}
internal data class JournalpostRequest(
    val tittel: String,
    val journalpostType: JournalPostType,
    val tema: String,
    val kanal: String?,
    val behandlingstema: String,
    val journalfoerendeEnhet: String,
    val avsenderMottaker: AvsenderMottaker,
    val bruker: Bruker,
    val sak: Fagsak,
    val dokumenter: List<JournalpostDokument>
)

data class AvsenderMottaker(
    val id: String,
    val idType: String = "FNR",
    val navn: String
)

data class Bruker(
    val id: String,
    val idType: String = "FNR"
)

data class Fagsak(
    val fagsakId: String,
    val fagsaksystem: String = "SUPSTONAD",
    val sakstype: String = "FAGSAK"
)

data class JournalpostDokument(
    val tittel: String,
    val dokumentKategori: DokumentKategori,
    val brevkode: String = "XX.YY-ZZ",
    val dokumentvarianter: List<DokumentVariant>
)

sealed class DokumentVariant {
    abstract val filtype: String
    abstract val fysiskDokument: String
    abstract val variantformat: String

    data class ArkivPDF(
        override val fysiskDokument: String,
    ) : DokumentVariant() {
        override val filtype: String = "PDFA"
        override val variantformat: String = "ARKIV"
    }

    data class OriginalJson(
        override val fysiskDokument: String,
    ) : DokumentVariant() {
        override val filtype: String = "JSON"
        override val variantformat: String = "ORIGINAL"
    }
}

enum class JournalPostType(val type: String) {
    INNGAAENDE("INNGAAENDE"),
    UTGAAENDE("UTGAAENDE")
}

enum class DokumentKategori(val type: String) {
    SOK("SOK"),
    VB("VB"),
    IB("IB")
}











