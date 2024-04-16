package soknad

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.serialization.jackson.jackson
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.routing.Route
import io.ktor.server.routing.routing
import io.ktor.server.testing.handleRequest
import io.ktor.server.testing.setBody
import io.ktor.server.testing.withTestApplication
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.mockk
import libs.common.util.RetryResult
import no.nav.etterlatte.common.toJson
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadRequest
import no.nav.etterlatte.libs.utils.test.InnsendtSoeknadFixtures
import no.nav.etterlatte.soknad.SoeknadService
import no.nav.etterlatte.soknad.soknadApi
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

internal class SoeknadRouteKtTest {
    private val service = mockk<SoeknadService>()
    private val dummyJson = """{"dummy":"json"}"""
    private val kilde = "omstillingsstoenad-ui"

    @Test
    fun `Skal lagre søknader`() {
        val soeknad = SoeknadRequest(listOf(
            InnsendtSoeknadFixtures.omstillingsSoeknad()
        ))

        withTestApplication({ testModule { soknadApi(service) } }) {
            coEvery { service.sendSoeknader(any(), kilde) } returns RetryResult.Success()
            handleRequest(HttpMethod.Post, "/api/soeknad?kilde=$kilde") {
                addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                setBody(soeknad.toJson())
            }.apply {
                assertEquals(HttpStatusCode.OK, response.status())
                coVerify(exactly = 1) { service.sendSoeknader(any(), kilde) }
            }
        }
    }

    @Test
    fun `Skal lagre kladd`() {
        withTestApplication({ testModule { soknadApi(service) } }) {
            coEvery { service.lagreKladd(any(), kilde) } returns RetryResult.Success(1)
            handleRequest(HttpMethod.Post, "/api/kladd?kilde=$kilde") {
                addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                setBody(dummyJson)
            }.apply {
                assertEquals(HttpStatusCode.OK, response.status())
                assertEquals("1", response.content)
                coVerify(exactly = 1) { service.lagreKladd(any(), kilde) }
            }
        }
    }

    @Test
    fun `Skal hente kladd`() {
        withTestApplication({ testModule { soknadApi(service) } }) {
            coEvery { service.hentKladd(kilde) } returns RetryResult.Success(jacksonObjectMapper().readTree(dummyJson))
            handleRequest(HttpMethod.Get, "/api/kladd?kilde=$kilde").apply {
                assertEquals(HttpStatusCode.OK, response.status())
                assertEquals(dummyJson, response.content)
                coVerify(exactly = 1) { service.hentKladd(kilde) }
            }
        }
    }

    @Test
    fun `Skal håndtere at kladd ikke finnes`() {
        withTestApplication({ testModule { soknadApi(service) } }) {
            coEvery { service.hentKladd(kilde) } returns RetryResult.Success(HttpStatusCode.NotFound)
            handleRequest(HttpMethod.Get, "/api/kladd?kilde=$kilde").apply {
                assertEquals(HttpStatusCode.NotFound, response.status())
                coVerify(exactly = 1) { service.hentKladd(kilde) }
            }
        }
    }

    @Test
    fun `Skal slette kladd`() {
        withTestApplication({ testModule { soknadApi(service) } }) {
            coEvery { service.slettKladd(kilde) } returns RetryResult.Success(HttpStatusCode.OK)
            handleRequest(HttpMethod.Delete, "/api/kladd?kilde=$kilde").apply {
                assertEquals(HttpStatusCode.OK, response.status())
                coVerify(exactly = 1) { service.slettKladd(kilde) }
            }
        }
    }
}

fun Application.testModule(routes: Route.() -> Unit) {
    install(ContentNegotiation) {
        jackson {
            enable(DeserializationFeature.READ_UNKNOWN_ENUM_VALUES_AS_NULL)
            disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
            disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
            registerModule(JavaTimeModule())
        }
    }

    routing {
        routes()
    }
}
