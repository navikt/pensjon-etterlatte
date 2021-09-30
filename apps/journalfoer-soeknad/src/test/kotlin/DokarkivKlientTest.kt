import com.fasterxml.jackson.databind.node.ArrayNode
import io.ktor.client.HttpClient
import io.ktor.client.engine.mock.MockEngine
import io.ktor.client.engine.mock.respond
import io.ktor.client.features.json.JacksonSerializer
import io.ktor.client.features.json.JsonFeature
import io.ktor.http.ContentType
import io.ktor.http.fullPath
import io.ktor.http.headersOf
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.DokarkivKlient
import no.nav.etterlatte.libs.common.journalpost.AvsenderMottaker
import no.nav.etterlatte.libs.common.journalpost.Bruker
import no.nav.etterlatte.libs.common.journalpost.JournalPostType
import no.nav.etterlatte.libs.common.journalpost.JournalpostRequest
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

internal class DokarkivKlientTest {

    private val baseUrl = "https://localhost.nav.no"

    private val httpClient = HttpClient(MockEngine) {
        engine {
            addHandler { request ->
                when (request.url.fullPath) {
                    "/" -> {
                        respond(
                            javaClass.getResource("/journalfoerResponse.json")!!.readText(),
                            headers = headersOf(
                                "Content-Type" to listOf(ContentType.Application.Json.toString())
                            )
                        )
                    }
                    else -> error("Unhandled ${request.url.fullPath}")
                }
            }
        }
        install(JsonFeature) { serializer = JacksonSerializer() }
    }

    private val klient = DokarkivKlient(httpClient, baseUrl)

    @Test
    fun `Enkel test av dokarkiv klient`() {
        val response = runBlocking { klient.journalfoerDok(dummyRequest()) }

        assertEquals("467010363", response.get("journalpostId").asText())
        assertEquals("true", response.get("journalpostferdigstilt").asText())
        assertEquals(1, (response.get("dokumenter") as ArrayNode).size())
    }

    private fun dummyRequest(): JournalpostRequest {
        return JournalpostRequest(
            "tittel",
            JournalPostType.INNGAAENDE,
            "tema",
            "kanal",
            "behandlingstema",
            "journalfoerendeEnhet",
            AvsenderMottaker("id", navn = "navn"),
            Bruker("id"),
            "eksternReferanseId",
            emptyList()
        )
    }
}