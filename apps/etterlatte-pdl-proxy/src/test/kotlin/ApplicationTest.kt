package no.nav.etterlatte

import com.typesafe.config.ConfigFactory
import com.typesafe.config.ConfigValueFactory
import io.ktor.config.HoconApplicationConfig
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.server.testing.TestApplicationEngine
import io.ktor.server.testing.createTestEnvironment
import io.ktor.server.testing.handleRequest
import no.nav.security.mock.oauth2.MockOAuth2Server
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
internal class ApplicationTest {

    val mockOAuth2 = MockOAuth2Server().apply { start() }
    var engine = TestApplicationEngine(createTestEnvironment {
        config = HoconApplicationConfig(ConfigFactory.load("applicationTest.conf")
            .withValue("tokenx.wellKnownUrl", ConfigValueFactory.fromAnyRef(mockOAuth2.wellKnownUrl("tokenx").toString()))
            .withValue("aad.wellKnownUrl", ConfigValueFactory.fromAnyRef(mockOAuth2.wellKnownUrl("aad").toString()))
        )
    }) {}.apply { start() }

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
