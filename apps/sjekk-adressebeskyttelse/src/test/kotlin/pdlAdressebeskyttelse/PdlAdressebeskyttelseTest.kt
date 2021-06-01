package no.nav.etterlatte.pdlAdressebeskyttelse

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

internal class PdlAdressebeskyttelseTest {

    @Test
    fun SjekkAdressebeskyttelse() {

        val httpClient = HttpClient(MockEngine) {
            engine {
                addHandler { request ->
                    when (request.url.fullPath) {
                        "/" -> {
                            val response = javaClass.getResource("/pdlMock1.json").readText().replace(Regex("[\n\t]"), "")
                            val responseHeaders =
                                headersOf("Content-Type" to listOf(ContentType.Application.Json.toString()))
                            respond(response, headers = responseHeaders
                            )
                        }
                        else -> error("Unhandled ${request.url.fullPath}")
                    }
                }
            }
            install(JsonFeature) { serializer = JacksonSerializer() }
        }




        runBlocking {
            PdlAdressebeskyttelse(httpClient, "https://pdl.no/").finnAdressebeskyttelseForFnr(listOf("12334466","4231423142","234234325")).also {
                //fikset, men dette er ikke pen
                assertEquals("FORTROLIG", it.get("data").get("hentPersonBolk").get(0).get("person").get("adressebeskyttelse").get(0).get("gradering").textValue())

            }
        }

    }

}