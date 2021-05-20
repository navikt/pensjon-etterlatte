package no.nav.etterlatte.pdl

import io.ktor.client.HttpClient
import io.ktor.client.engine.mock.MockEngine
import io.ktor.client.engine.mock.respond
import io.ktor.client.features.json.JacksonSerializer
import io.ktor.client.features.json.JsonFeature
import io.ktor.http.ContentType
import io.ktor.http.fullPath
import io.ktor.http.headersOf
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

internal class PdlTest {

    @Test
    fun SjekkAdressebeskyttelse() {

        val httpClient = HttpClient(MockEngine) {
            engine {
                addHandler { request ->
                    when (request.url.fullPath) {
                        "/" -> {
                            val responseHeaders =
                                headersOf("Content-Type" to listOf(ContentType.Application.Json.toString()))
                            respond(
                                """{
                                    "data":{ 
                                        "hentPerson": {
                                            "forelderBarnRelasjon": [{
                                               "relatertPersonsIdent": "321",
                                               "relatertPersonsRolle": "BARN"
                                            },
                                            {
                                               "relatertPersonsIdent": "456",
                                               "relatertPersonsRolle": "FAR"
                                            }]
                                        }
                                    }
                                }""",
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
            Pdl(httpClient, "https://pdl.no/").finnAdressebeskyttelseForFnr("abc").also {
                assertEquals("321", it.get(0))
                assertEquals(1, it.size)
            }
        }

    }

}