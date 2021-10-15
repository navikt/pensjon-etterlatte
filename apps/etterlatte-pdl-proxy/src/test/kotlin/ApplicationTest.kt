package no.nav.etterlatte

import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.server.testing.TestApplicationEngine
import io.ktor.server.testing.handleRequest
import no.nav.security.mock.oauth2.MockOAuth2Server
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
internal class ApplicationTest {

    val mockOAuth2 = MockOAuth2Server().apply { start() }
    var engine = TestApplicationEngine(applicationEngineEnvironment(ApplicationContext("applicationTest.conf")))
    .apply { start() }

    @AfterAll
    fun tearDown(){
        mockOAuth2.shutdown()
        engine.stop(0,0)
    }

    @Test
    fun testRoot() {
        engine.handleRequest(HttpMethod.Get, "internal/is_alive").apply {
            assertEquals(HttpStatusCode.OK, response.status())
            assertEquals("Alive", response.content)
        }
    }

    @Test
    fun testPDL() {
        engine.handleRequest(HttpMethod.Post, "tokenx/pdl").apply {
            assertEquals(HttpStatusCode.Unauthorized, response.status())
        }
    }

    //@Test
    fun testDok() {
        engine.handleRequest(HttpMethod.Post, "aad/dok").apply {
            assertEquals(HttpStatusCode.Unauthorized, response.status())
        }
    }
}
