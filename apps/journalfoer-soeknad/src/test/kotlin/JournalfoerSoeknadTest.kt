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
import no.nav.etterlatte.libs.common.journalpost.JournalpostRequest
import no.nav.etterlatte.libs.common.objectMapper
import no.nav.helse.rapids_rivers.testsupport.TestRapid
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import java.nio.file.Paths
import java.time.Clock
import java.time.LocalDateTime
import java.time.Month
import java.time.ZoneId
import java.time.ZoneOffset

internal class JournalfoerSoeknadTest {

    private val journalfoeringService = JournalfoeringService(JournalfoerDokMock("/journalfoerResponse.json"))

    private fun getTestResource(file: String): String {
        return javaClass.getResource(file).readText().replace(Regex("[\n\t]"), "")
    }

    @Test
    fun journalfoer() {
        val clock: Clock = Clock.fixed(LocalDateTime.of(2020, Month.MAY, 5, 14, 5, 2).toInstant(ZoneOffset.UTC), ZoneId.of("UTC"))
        val message = getTestResource("/fullMessage.json")
        val inspector = TestRapid()
            .apply { JournalfoerSoeknad(this, GenererPdfMock(), journalfoeringService, clock) }
            .apply {
                sendTestMessage(
                    message
                )
            }.inspektør
        assertEquals("true", inspector.message(0).get("@dokarkivRetur").get("journalpostferdigstilt").asText())
        assertTrue(inspector.message(0).get("@journalpostInfo").get("journlanfoerendeEnhet").isNull)
        assertEquals("123", inspector.message(0).get("@dokarkivRetur").get("dokumenter")[0].get("dokumentInfoId").asText())
        assertEquals("467010363", inspector.message(0).get("@dokarkivRetur").get("journalpostId").asText())

    }

    @Test
    fun testAvbruttPgaTid() {
        val clock: Clock = Clock.fixed(LocalDateTime.of(2023, Month.MAY, 5, 14, 5, 2).toInstant(ZoneOffset.UTC), ZoneId.of("UTC"))
        val message = getTestResource("/fullMessage.json")
        val inspector = TestRapid()
            .apply { JournalfoerSoeknad(this, GenererPdfMock(), journalfoeringService, clock) }
            .apply {
                sendTestMessage(
                    message
                )
            }.inspektør

        assertEquals(0, inspector.size )
    }

    @Test
    fun testPdfGen() {
        val message = objectMapper.readTree(getTestResource("/fullMessage.json"))
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
            PdfGenerator(httpClient, "https://ey-pdfgen/api/v1/genpdf/eypdfgen").genererPdf(
                message.get("@skjema_info"),
                "soknad"
            ).also {
                Paths.get("src/test/resources/pdf.pdf").toFile().writeBytes(it)
                assertEquals(String(it), "Dette er en veldig spennende PDF")
            }
        }
    }

}

private class JournalfoerDokMock(val file: String) : Dokarkiv {
    override suspend fun journalfoerDok(request: JournalpostRequest): JsonNode {
        val json = javaClass.getResource(file)!!.readText().replace(Regex("[\n\t]"), "")

        return objectMapper.readTree(json)
    }
}

class GenererPdfMock : GenererPdf {
    override suspend fun genererPdf(input: JsonNode, template: String): ByteArray {
        return Paths.get("src/test/resources/pdf.pdf").toFile().readBytes()
    }
}
