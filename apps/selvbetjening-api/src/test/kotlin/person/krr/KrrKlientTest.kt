package person.krr

import io.kotest.matchers.shouldBe
import io.ktor.client.HttpClient
import io.ktor.client.engine.mock.MockEngine
import io.ktor.client.engine.mock.respond
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.http.ContentType
import io.ktor.http.HttpStatusCode
import io.ktor.http.fullPath
import io.ktor.http.headersOf
import io.ktor.serialization.jackson.jackson
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.common.toJson
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.person.krr.DigitalKontaktinformasjon
import no.nav.etterlatte.person.krr.KrrKlient
import org.junit.jupiter.api.Test

internal class KrrKlientTest {
    private fun opprettKlient(responseContent: DigitalKontaktinformasjon, status: HttpStatusCode): KrrKlient {
        val httpClient = HttpClient(MockEngine) {
            engine {
                addHandler { request ->
                    when (request.url.fullPath) {
                        "/person" -> {
                            respond(
                                responseContent.toJson(),
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

        return KrrKlient(httpClient)
    }

    @Test
    fun `Skal returnere informasjon om kontaktinformasjon`() {
        val expectedResponse = opprettDigitalKontaktInfo()
        val klient = opprettKlient(expectedResponse, HttpStatusCode.OK)

        val response = runBlocking {
            klient.hentDigitalKontaktinformasjon(Foedselsnummer.of("11057523044"))
        }

        response?.epostadresse shouldBe expectedResponse.epostadresse
        response?.mobiltelefonnummer shouldBe expectedResponse.mobiltelefonnummer
        response?.spraak shouldBe expectedResponse.spraak
    }


    @Test
    fun `Skal returnere null ved feilmelding`() {
        val expectedResponse = opprettDigitalKontaktInfo()
        val klient = opprettKlient(expectedResponse, HttpStatusCode.InternalServerError)

        val response = runBlocking {
            klient.hentDigitalKontaktinformasjon(Foedselsnummer.of("11057523044"))
        }

        response shouldBe null
    }

    private fun opprettDigitalKontaktInfo(): DigitalKontaktinformasjon = DigitalKontaktinformasjon(
        personident = "11057523044",
        aktiv = true,
        kanVarsles = true,
        reservert = false,
        spraak = "nb",
        epostadresse = "noreply@nav.no",
        mobiltelefonnummer = "11111111",
        sikkerDigitalPostkasse = null
    )
}
