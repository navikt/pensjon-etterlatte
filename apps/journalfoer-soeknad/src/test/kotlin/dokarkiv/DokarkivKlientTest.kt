package dokarkiv

import io.ktor.client.HttpClient
import io.ktor.client.engine.mock.MockEngine
import io.ktor.client.engine.mock.respond
import io.ktor.client.plugins.ResponseException
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.fullPath
import io.ktor.http.headersOf
import io.ktor.serialization.jackson.jackson
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.fail

internal class DokarkivKlientTest {

    private val baseUrl = "https://localhost.nav.no/"

    private fun opprettKlient(responseContent: String, status: HttpStatusCode): DokarkivKlient {
        val httpClient = HttpClient(MockEngine) {
            engine {
                addHandler { request ->
                    when (request.url.fullPath) {
                        "/" -> {
                            respond(
                                responseContent,
                                status,
                                headersOf(
                                    "Content-Type" to listOf(ContentType.Application.Json.toString())
                                )
                            )
                        }
                        else -> error("Unhandled ${request.url.fullPath}")
                    }
                }
            }
            install(ContentNegotiation) { jackson() }
        }

        return DokarkivKlient(httpClient, baseUrl)
    }

    @Test
    fun `Enkel test av dokarkiv klient`() {
        val successResponse = javaClass.getResource("/dokarkiv/journalfoerResponse.json")!!.readText()

        val klient = opprettKlient(successResponse, HttpStatusCode.OK)

        val response = runBlocking { klient.journalfoerDok(dummyRequest(), false) }

        assertEquals("467010363", response.journalpostId)
        assertEquals(true, response.journalpostferdigstilt)
        assertEquals(1, response.dokumenter.size)
    }

    @Test
    fun `Soeknad har allerede blitt journalfoert`() {
        val successResponse = javaClass.getResource("/dokarkiv/errorResponse.json")!!.readText()

        val klient = opprettKlient(successResponse, HttpStatusCode.Conflict)

        try {
            runBlocking { klient.journalfoerDok(dummyRequest(), false) }

            fail("Skal kaste feil ved HttpStatusCode.Conflict (409)")
        } catch (re: ResponseException) {
            assertEquals(HttpStatusCode.Conflict, re.response.status)
        }
    }

    private fun dummyRequest(): JournalpostRequest {
        return JournalpostRequest(
            "tittel",
            "PEN",
            JournalPostType.INNGAAENDE,
            "behandlingstema",
            "journalfoerendeEnhet",
            AvsenderMottaker("id", navn = "navn"),
            Bruker("id"),
            "eksternReferanseId",
            null,
            emptyList()
        )
    }
}