package soknad

import io.ktor.application.Application
import io.ktor.application.install
import io.ktor.features.ContentNegotiation
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.jackson.jackson
import io.ktor.routing.Route
import io.ktor.routing.routing
import io.ktor.server.testing.handleRequest
import io.ktor.server.testing.setBody
import io.ktor.server.testing.withTestApplication
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.mockk
import no.nav.etterlatte.common.RetryResult
import no.nav.etterlatte.common.toJson
import no.nav.etterlatte.soknad.SoeknadService
import no.nav.etterlatte.soknad.soknadApi
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import soeknad.SoeknadFixtures

class SoeknadRouteKtTest {
    private val service = mockk<SoeknadService>()
    private val dummyJson = """{"dummy":"json"}"""

    @Test
    fun `Skal lagre søknad`() {
        val soeknad = SoeknadFixtures.soeknadMedBarnepensjon

        withTestApplication({ testModule { soknadApi(service) } }) {
            coEvery { service.sendSoeknad(any()) } returns RetryResult.Success()
            handleRequest(HttpMethod.Post, "/api/soeknad") {
                addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                setBody(soeknad.toJson())
            }.apply {
                assertEquals(HttpStatusCode.OK, response.status())
                coVerify(exactly = 1) { service.sendSoeknad(any()) }
            }
        }
    }

    @Test
    fun `Skal lagre kladd`() {
        withTestApplication({ testModule { soknadApi(service) } }) {
            coEvery { service.lagreKladd(any()) } returns RetryResult.Success(1)
            handleRequest(HttpMethod.Post, "/api/kladd") {
                addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                setBody("""{"dummy":"json"}""")
            }.apply {
                assertEquals(HttpStatusCode.OK, response.status())
                assertEquals("1", response.content)
                coVerify(exactly = 1) { service.lagreKladd(any()) }
            }
        }
    }


    @Test
    fun `Skal hente kladd`() {
        withTestApplication({ testModule { soknadApi(service) } }) {
            coEvery { service.hentKladd() } returns RetryResult.Success(dummyJson)
            handleRequest(HttpMethod.Get, "/api/kladd").apply {
                assertEquals(HttpStatusCode.OK, response.status())
                assertEquals(dummyJson, response.content)
                coVerify(exactly = 1) { service.hentKladd() }
            }
        }
    }

    @Test
    fun `Skal håndtere at kladd ikke finnes`() {
        withTestApplication({ testModule { soknadApi(service) } }) {
            coEvery { service.hentKladd() } returns RetryResult.Success(HttpStatusCode.NotFound)
            handleRequest(HttpMethod.Get, "/api/kladd").apply {
                assertEquals(HttpStatusCode.NotFound, response.status())
                coVerify(exactly = 1) { service.hentKladd() }
            }
        }
    }

    @Test
    fun `Skal slette kladd`() {
        withTestApplication({ testModule { soknadApi(service) } }) {
            coEvery { service.slettKladd() } returns RetryResult.Success(HttpStatusCode.OK)
            handleRequest(HttpMethod.Delete, "/api/kladd").apply {
                assertEquals(HttpStatusCode.OK, response.status())
                coVerify(exactly = 1) { service.slettKladd() }
            }
        }
    }
}

fun Application.testModule(routes: Route.() -> Unit) {
    install(ContentNegotiation) { jackson() }

    routing {
        routes()
    }
}
