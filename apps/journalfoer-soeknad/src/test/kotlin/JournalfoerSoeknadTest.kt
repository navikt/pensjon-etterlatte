package no.nav.etterlatte

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonTypeRef
import dokarkiv.DokumentKategori
import dokarkiv.JournalpostDokument
import io.ktor.client.HttpClient
import io.ktor.client.engine.mock.MockEngine
import io.ktor.client.engine.mock.respond
import io.ktor.client.features.json.JacksonSerializer
import io.ktor.client.features.json.JsonFeature
import io.ktor.content.TextContent
import io.ktor.http.ContentType
import io.ktor.http.fullPath
import io.ktor.http.headersOf
import io.mockk.Called
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.libs.common.pdl.Gradering
import no.nav.etterlatte.libs.common.soeknad.SoeknadType
import no.nav.etterlatte.pdf.DokumentService
import no.nav.helse.rapids_rivers.testsupport.TestRapid
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import pdf.PdfGeneratorKlient
import java.nio.file.Paths
import java.time.Clock
import java.time.LocalDateTime
import java.time.Month
import java.time.ZoneId
import java.time.ZoneOffset

internal class JournalfoerSoeknadTest {

    private val journalfoeringService = mockk<JournalfoeringService> {
        every {
            journalfoer(any(), any(), any(), any(), any())
        } returns jacksonObjectMapper().readValue(getResource("/dokarkiv/journalfoerResponse.json"), jacksonTypeRef())
    }

    private val dokumentServiceMock = mockk<DokumentService> {
        every {
            opprettJournalpostDokument(any(), any(), any())
        } returns JournalpostDokument("tittel", DokumentKategori.SOK, "", emptyList())
    }

    @Test
    fun `Gyldig melding på rapid trigger journalføring`() {
        val clock: Clock = Clock.fixed(LocalDateTime.of(2020, Month.MAY, 5, 14, 5, 2).toInstant(ZoneOffset.UTC), ZoneId.of("UTC"))
        val inspector = TestRapid()
            .apply { JournalfoerSoeknad(this, dokumentServiceMock, journalfoeringService, clock) }
            .apply { sendTestMessage(getResource("/fullMessage.json")) }
            .inspektør

        assertEquals("true", inspector.message(0).get("@dokarkivRetur").get("journalpostferdigstilt").asText())
        assertEquals("123", inspector.message(0).get("@dokarkivRetur").get("dokumenter")[0].get("dokumentInfoId").asText())
        assertEquals("467010363", inspector.message(0).get("@dokarkivRetur").get("journalpostId").asText())

        verify(exactly = 1) { dokumentServiceMock.opprettJournalpostDokument("12", any(), "gjenlevendepensjon") }
        verify(exactly = 1) { journalfoeringService.journalfoer("12", "5555555555", Gradering.UGRADERT, any(), SoeknadType.Gjenlevendepensjon) }
    }

    @Test
    fun testAvbruttPgaTid() {
        val clock: Clock = Clock.fixed(LocalDateTime.of(2023, Month.MAY, 5, 14, 5, 2).toInstant(ZoneOffset.UTC), ZoneId.of("UTC"))
        val inspector = TestRapid()
            .apply { JournalfoerSoeknad(this, dokumentServiceMock, journalfoeringService, clock) }
            .apply { sendTestMessage(getResource("/fullMessage.json")) }
            .inspektør

        assertEquals(0, inspector.size )

        verify { dokumentServiceMock wasNot Called }
        verify { journalfoeringService wasNot Called }
    }

    @Test
    fun testPdfGen() {
        val message = jacksonObjectMapper().readTree(getResource("/fullMessage.json"))
        val httpClient = HttpClient(MockEngine) {
            engine {
                addHandler { request ->
                    when (request.url.fullPath) {
                        "/api/v1/genpdf/eypdfgen/soknad" -> {
                            val req = jacksonObjectMapper().readTree((request.body as TextContent).text)
                            assertEquals(message.get("@skjema_info"), req)
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
            PdfGeneratorKlient(httpClient, "https://ey-pdfgen/api/v1/genpdf/eypdfgen").genererPdf(
                message.get("@skjema_info"),
                "soknad"
            ).also {
                Paths.get("src/test/resources/pdf.pdf").toFile().writeBytes(it)
                assertEquals(String(it), "Dette er en veldig spennende PDF")
            }
        }
    }

    private fun getResource(file: String): String =
        javaClass.getResource(file)!!.readText().replace(Regex("[\n\t]"), "")

}
