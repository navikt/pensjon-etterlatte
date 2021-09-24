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
import no.nav.etterlatte.libs.common.pdl.Gradering
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

internal class PdlKlientTest {

    @Test
    fun sjekkAdressebeskyttelse() {
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
            PdlKlient(httpClient, "https://pdl.no/").finnAdressebeskyttelseForFnr(listOf("12334466","4231423142","234234325")).also {
                //fikset, men dette er ikke pen
                assertEquals(Gradering.FORTROLIG, it.data!!.hentPersonBolk!![0].person!!.adressebeskyttelse[0].gradering)
            }
        }

    }

}