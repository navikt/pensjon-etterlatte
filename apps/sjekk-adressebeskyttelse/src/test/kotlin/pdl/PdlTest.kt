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

internal class PdlTest {

    //@Test
    fun SjekkAdressebeskyttelse() {

        val httpClient = HttpClient(MockEngine) {
            engine {
                addHandler { request ->
                    when (request.url.fullPath) {
                        "/" -> {
                            val response = javaClass.getResource("mockOne.json").readText().replace(Regex("[\n\t]"), "")
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
            Pdl(httpClient, "https://pdl.no/").finnAdressebeskyttelseForFnr(listOf("12334466","4231423142","234234325")).also {
                //assertEquals("321", it.get(0))
                assertEquals("321", it.flatMap { it.get("hentPersonBolk") }
                    .map { it.get("adressebeskyttelse") }
                    .map { it.get("gradering").get(0) })
                //assertEquals(1, it.size)
            }
        }

    }

}