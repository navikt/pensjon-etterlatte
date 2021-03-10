
//import no.nav.etterlatte.

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
    fun sjekkAlderForEtterlatte() {

        val httpClient = HttpClient(MockEngine){
            engine {
                addHandler { request ->
                    when (request.url.fullPath) {
                        "/" -> {
                            val responseHeaders = headersOf("Content-Type" to listOf(ContentType.Application.Json.toString()))
                            respond("""{
                                    "data":{ 
                                        "hentPerson": {
                                            "foedsel": {
                                               "foedselsdato": "1980-01-01"
                                            }
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
            PdlAlder(httpClient, "https://pdl.no/").sjekkAlderForEtterlatte("abc").also {
                assertEquals(41, it)
            }
        }

}

}