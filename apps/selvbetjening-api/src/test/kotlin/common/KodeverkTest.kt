package common

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.databind.DeserializationFeature
import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
import io.ktor.client.features.defaultRequest
import io.ktor.client.features.json.JacksonSerializer
import io.ktor.client.features.json.JsonFeature
import io.ktor.http.takeFrom
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.kodeverk.KodeverkService
import org.junit.jupiter.api.Test
import kotlin.test.assertEquals

class KodeverkTest {

    @Test
    fun hentPostnummere() {
        val httpClient = HttpClient(CIO) {
            install(JsonFeature) {
                serializer = JacksonSerializer {
                    configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                    setSerializationInclusion(JsonInclude.Include.NON_NULL)
                }
            }
            defaultRequest {
                url.takeFrom("https://kodeverk.dev.adeo.no/api/v1/kodeverk/Postnummer/koder/betydninger?spraak=nb")
                headers["Nav-Consumer-Id"] = "srvbarnepensjon"
            }
        }

        runBlocking {
            val poststed = KodeverkService(httpClient).hentPoststed("2730")
            assertEquals("LUNNER", poststed)
        }
    }

}