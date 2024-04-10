package pdl

import io.ktor.client.HttpClient
import io.ktor.client.engine.mock.MockEngine
import io.ktor.client.engine.mock.respond
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.http.ContentType
import io.ktor.http.fullPath
import io.ktor.http.headersOf
import io.ktor.serialization.jackson.jackson
import io.mockk.every
import io.mockk.mockk
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadType
import no.nav.etterlatte.libs.pdl.Gradering
import no.nav.etterlatte.libs.pdl.AdressebeskyttelseKlient
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

internal class AdressebeskyttelseKlientTest {

    private val fnr = mockk<Foedselsnummer> {
        every { value } returns "1234"
    }

    @Test
    fun sjekkAdressebeskyttelse() {
        val httpClient = HttpClient(MockEngine) {
            engine {
                addHandler { request ->
                    when (request.url.fullPath) {
                        "/" -> {
                            val response = javaClass.getResource("/pdl/pdlMock1.json").readText().replace(Regex("[\n\t]"), "")
                            val responseHeaders =
                                headersOf("Content-Type" to listOf(ContentType.Application.Json.toString()))
                            respond(response, headers = responseHeaders)
                        }
                        else -> error("Unhandled ${request.url.fullPath}")
                    }
                }
            }
            install(ContentNegotiation) { jackson() }
        }

        runBlocking {
            AdressebeskyttelseKlient(httpClient, "https://pdl.no/").finnAdressebeskyttelseForFnr(listOf(fnr), SoeknadType.BARNEPENSJON).also {
                assertEquals(
                    Gradering.FORTROLIG,
                    it.data?.hentPersonBolk?.get(0)?.person?.adressebeskyttelse?.get(0)?.gradering
                )
                assertEquals("12345678910", it.data?.hentPersonBolk?.get(0)?.ident)
            }
        }
    }
}
