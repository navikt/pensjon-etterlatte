package no.nav.etterlatte

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.treeToValue
import io.ktor.client.HttpClient
import io.ktor.client.request.accept
import io.ktor.client.request.header
import io.ktor.client.request.parameter
import io.ktor.client.request.post
import io.ktor.http.ContentType
import io.ktor.http.contentType
import no.nav.etterlatte.libs.common.journalpost.AvsenderMottaker
import no.nav.etterlatte.libs.common.journalpost.Bruker
import no.nav.etterlatte.libs.common.journalpost.DokumentKategori
import no.nav.etterlatte.libs.common.journalpost.DokumentVariant
import no.nav.etterlatte.libs.common.journalpost.JournalPostType
import no.nav.etterlatte.libs.common.journalpost.JournalpostDokument
import no.nav.etterlatte.libs.common.journalpost.JournalpostInfo
import no.nav.etterlatte.libs.common.journalpost.JournalpostRequest
import no.nav.helse.rapids_rivers.JsonMessage
import org.slf4j.MDC
import java.util.*

class Journalfoer(private val client: HttpClient, private val baseUrl: String) : JournalfoerDok {
    private val objectMapper = jacksonObjectMapper()
        .registerModule(JavaTimeModule())
        .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
        .disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)

    override suspend fun journalfoerDok(dokumentInnhold: JsonMessage, pdf: ByteArray): JsonNode {

        val journalpostInfo: JournalpostInfo? = objectMapper.treeToValue(dokumentInnhold["@journalpostInfo"])
        val lagretSoeknadId = dokumentInnhold["@lagret_soeknad_id"]

        val journalpostrequest = journalpostInfo?.let {

            JournalpostRequest(
                tittel = journalpostInfo.tittel + lagretSoeknadId,
                journalpostType = JournalPostType.INNGAAENDE,
                journalfoerendeEnhet = journalpostInfo.journalfoerendeEnhet,
                tema = "PEN",
                //eksternReferanseId = journalpostInfo.tittel + lagretSoeknadId,
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
                dokumenter = listOf(
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
            )
        }
        return client.post(baseUrl) {
            parameter("forsoekFerdigstill", true)
            accept(ContentType.Application.Json)
            contentType(ContentType.Application.Json)
            header("X-Correlation-ID", MDC.get("X-Correlation-ID") ?: UUID.randomUUID().toString())
            body = journalpostrequest!!

        }
    }
}


