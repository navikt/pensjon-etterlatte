package no.nav.etterlatte

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.treeToValue
import io.ktor.client.HttpClient
import io.ktor.client.request.header
import io.ktor.client.request.post
import no.nav.helse.rapids_rivers.JsonMessage
import org.slf4j.MDC
import java.util.*
import no.nav.etterlatte.libs.common.journalpost.*

class Journalfoer(private val client: HttpClient, private val baseUrl: String) : JournalfoerDok {
    private val objectMapper = jacksonObjectMapper()
        .registerModule(JavaTimeModule())
        .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
        .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)

    override suspend fun journalfoerDok(dokumentInnhold: JsonMessage, pdf: ByteArray): String {
        val journalpostInfo: JournalpostInfo? = objectMapper.treeToValue(dokumentInnhold["@journalpostInfo"])

        return journalpostInfo?.let {

            val dok: List<JournalpostDokument> = listOf(
                JournalpostDokument(
                    tittel = journalpostInfo.tittel,
                    dokumentKategori = DokumentKategori.SOK,
                    dokumentvarianter = listOf(
                        DokumentVariant.ArkivPDF(fysiskDokument = Base64.getEncoder().encodeToString(pdf)),
                        DokumentVariant.OriginalJson(
                            fysiskDokument = Base64.getEncoder().encodeToString(
                                objectMapper.writeValueAsString(dokumentInnhold["@skjema_info"]).toByteArray()
                            )
                        )
                    )
                )
            )

            client.post<String>(baseUrl) {
                listOf("forsoekFerdigstill" to "true")
                header("Content-Type", "application/json")
                header("Accept", "application/json")
                header("X-Correlation-ID", MDC.get("X-Correlation-ID") ?: UUID.randomUUID().toString())
                body =

                    JournalpostRequest(
                        tittel = journalpostInfo.tittel,
                        journalpostType = JournalPostType.INNGAAENDE,
                        journalfoerendeEnhet = "4817",
                        tema = "PEN",
                        kanal = "NAV_NO",
                        behandlingstema = "ab0255",
                        avsenderMottaker = AvsenderMottaker(
                            id = journalpostInfo.avsenderMottaker.id,
                            navn = journalpostInfo.avsenderMottaker.navn,
                            idType = journalpostInfo.avsenderMottaker.idType
                        ),
                        bruker = Bruker(
                            id = journalpostInfo.bruker.id,
                            idType = journalpostInfo.bruker.idType
                        ),

                        /*   sak = Fagsak(
                               fagsakId = "id",
                               fagsaksystem = "BP",
                               sakstype = "soknad"
                               ),
                         */

                        dokumenter = dok
                    )
            }
        }
            ?: "klarte ikke å journalføre"
    }
}
