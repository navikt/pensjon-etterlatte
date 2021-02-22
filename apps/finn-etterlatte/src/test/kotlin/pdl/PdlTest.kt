package pdl

import io.ktor.client.*
import io.ktor.client.engine.mock.*
import io.ktor.client.features.json.*
import io.ktor.http.*
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.pdl.Pdl
import org.junit.jupiter.api.Test

import org.junit.jupiter.api.Assertions.*

internal class PdlTest {

    @Test
    fun finnEtterlatteForPerson() {

        val httpClient = HttpClient(MockEngine){
            engine {
                addHandler { request ->
                    when (request.url.fullPath) {
                        "/" -> {
                            val responseHeaders = headersOf("Content-Type" to listOf(ContentType.Application.Json.toString()))
                            respond("""{
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
                                headers = responseHeaders)
                        }
                        else -> error("Unhandled ${request.url.fullPath}")
                    }
                }
            }
            install(JsonFeature) {serializer = JacksonSerializer() } }




        runBlocking {
            Pdl(httpClient, "https://pdl.no/").finnEtterlatteForPerson("abc").also {
                assertEquals("321", it.get(0))
                assertEquals(1, it.size)
            }
        }

}

}