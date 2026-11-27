package no.nav.etterlatte.mottak.journalfoering

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import io.ktor.client.HttpClient
import io.ktor.client.call.body
import io.ktor.client.request.accept
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.content.TextContent
import io.ktor.http.contentType
import io.ktor.http.isSuccess
import no.nav.etterlatte.libs.utils.logging.CORRELATION_ID
import no.nav.etterlatte.libs.utils.logging.getCorrelationId
import no.nav.etterlatte.sikkerLogg
import org.slf4j.LoggerFactory

/** Feil fra dokarkiv. Meldingen har bare status, siden svaret kan gjengi personopplysninger. Svaret logges til team-logs. */
class DokarkivFeil(
    status: HttpStatusCode,
) : RuntimeException("Dokarkiv svarte ${status.value} ved journalføring")

class PdfgenFeil(
    mal: String,
    status: HttpStatusCode,
) : RuntimeException("ey-pdfgenrs svarte ${status.value} for mal $mal")

class DokarkivKlient(
    private val client: HttpClient,
    private val url: String,
) {
    private val logger = LoggerFactory.getLogger(this::class.java)

    /** Returnerer eksisterende journalpost ved 409, slik dagens journalføring i Gjenny gjør. */
    suspend fun opprettJournalpost(
        request: OpprettJournalpostRequest,
        forsoekFerdigstill: Boolean,
    ): OpprettJournalpostResponse {
        val response =
            client.post("$url?forsoekFerdigstill=$forsoekFerdigstill") {
                accept(ContentType.Application.Json)
                contentType(ContentType.Application.Json)
                setBody(request)
            }

        return when {
            response.status.isSuccess() -> {
                response.body<OpprettJournalpostResponse>().also {
                    logger.info(
                        "Journalpost opprettet (journalpostId=${it.journalpostId}, ferdigstilt=${it.journalpostferdigstilt})",
                    )
                }
            }

            response.status == HttpStatusCode.Conflict -> {
                response.body<OpprettJournalpostResponse>().also {
                    logger.warn("Journalpost ${it.journalpostId} fantes allerede for eksternReferanseId")
                }
            }

            else -> {
                sikkerLogg.error("Dokarkiv svarte ${response.status.value}: ${response.bodyAsText()}")
                throw DokarkivFeil(response.status)
            }
        }
    }
}

class PdfgenKlient(
    private val client: HttpClient,
    private val pdfgenrsUrl: String,
) {
    suspend fun genererPdf(
        mal: String,
        soeknadJson: String,
    ): ByteArray {
        val respons =
            client.post("$pdfgenrsUrl/eypdfgen/$mal") {
                header(CORRELATION_ID, getCorrelationId())
                setBody(TextContent(soeknadJson, ContentType.Application.Json))
            }
        if (!respons.status.isSuccess()) {
            throw PdfgenFeil(mal, respons.status)
        }
        return respons.body()
    }
}

@Suppress("unused")
data class OpprettJournalpostRequest(
    val tittel: String,
    val tema: String,
    val journalfoerendeEnhet: String?,
    val avsenderMottaker: AvsenderMottaker?,
    val bruker: Bruker?,
    val eksternReferanseId: String,
    val sak: JournalpostSak?,
    val dokumenter: List<JournalpostDokument>,
) {
    val journalpostType: String = "INNGAAENDE"
    val kanal: String = "NAV_NO"
}

@JsonIgnoreProperties(ignoreUnknown = true)
data class OpprettJournalpostResponse(
    val journalpostId: String,
    val journalpostferdigstilt: Boolean,
    val dokumenter: List<DokumentInfo> = emptyList(),
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    data class DokumentInfo(
        val dokumentInfoId: String,
    )
}

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

@Suppress("unused")
data class JournalpostSak(
    val fagsakId: String,
) {
    val sakstype: String = "FAGSAK"
    val fagsaksystem: String = "EY"
}

@Suppress("unused")
data class AvsenderMottaker(
    val id: String,
) {
    val navn: String = ""
    val idType: String = "FNR"
}

@Suppress("unused")
data class Bruker(
    val id: String,
) {
    val idType = "FNR"
}

@Suppress("unused")
data class JournalpostDokument(
    val tittel: String,
    val dokumentvarianter: List<DokumentVariant>,
) {
    val dokumentKategori = "SOK"
    val brevkode = "XX.YY-ZZ"
}