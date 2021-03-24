package no.nav.etterlatte

import com.fasterxml.jackson.annotation.JsonProperty
import io.ktor.client.HttpClient
import io.ktor.client.request.header
import io.ktor.client.request.post
import no.nav.helse.rapids_rivers.JsonMessage
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.slf4j.MDC
import java.util.*


//internal const val suPdfGenPath = "/api/v1/genpdf/supdfgen"
//internal const val SOKNAD_TEMPLATE = "soknad"

class Journalfoer(private val client: HttpClient, private val apiUrl: String) : JournalfoerDok {


    private val log: Logger = LoggerFactory.getLogger(this::class.java)

    override suspend fun journalfoerDok(dokumentInnhold: JsonMessage, pdf: ByteArray): String {
        val apiUrl = "hvorfinnerjegDokarkiv"


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
            ),
        )
        return client.post<String>(apiUrl) {
            listOf("forsoekFerdigstill" to "true")
            header("Content-Type", "application/json")
            header("Accept", "application/json")
            header("X-Correlation-ID", MDC.get("X-Correlation-ID") ?: UUID.randomUUID().toString())
            body = JournalpostRequest(
                tittel = dokumentInnhold["@dok_tittel"].asText(),
                journalpostType = JournalPostType.INNGAAENDE,
                tema = dokumentInnhold["@dok_tema"].asText(),
                kanal = dokumentInnhold["@dok_tittel"].asText(),
                behandlingstema = dokumentInnhold["@dok_tittel"].asText(),
                journalfoerendeEnhet = dokumentInnhold["@dok_tittel"].asText(),
                avsenderMottaker = AvsenderMottaker(
                    id = "id",
                    navn = "navn"
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
        }
    }

    internal data class JournalpostRequest(
        @JsonProperty("@dok_tittel") val tittel: String,
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
}
