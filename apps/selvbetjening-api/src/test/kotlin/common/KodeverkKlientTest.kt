package common

import com.fasterxml.jackson.annotation.JsonInclude
import com.fasterxml.jackson.databind.DeserializationFeature
import io.ktor.client.HttpClient
import io.ktor.client.engine.cio.CIO
import io.ktor.client.plugins.contentnegotiation.ContentNegotiation
import io.ktor.client.plugins.defaultRequest
import io.ktor.http.takeFrom
import io.ktor.serialization.jackson.jackson
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.kodeverk.KodeverkKlient
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@Disabled
internal class KodeverkKlientTest {

    lateinit var httpClient: HttpClient

    @BeforeAll
    fun setupClient() {
        httpClient = HttpClient(CIO) {
            install(ContentNegotiation) {
                jackson {
                    configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                    setSerializationInclusion(JsonInclude.Include.NON_NULL)
                }
            }
            defaultRequest {
                url.takeFrom("https://kodeverk.dev.adeo.no/api/v1/kodeverk/Postnummer/koder/betydninger?spraak=nb")
                headers["Nav-Consumer-Id"] = "srvbarnepensjon"
            }
        }
    }

    @Test
    fun hentPostnummere() {
        runBlocking {
            val client = KodeverkKlient(httpClient)

            val kodeverkResponse = client.hentPostnummer()

            assertTrue(kodeverkResponse.betydninger.isNotEmpty())
        }
    }

}