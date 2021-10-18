package no.nav.etterlatte

import com.nimbusds.jwt.SignedJWT
import com.typesafe.config.ConfigFactory
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.server.testing.TestApplicationEngine
import io.ktor.server.testing.handleRequest
import no.nav.security.mock.oauth2.MockOAuth2Server
import no.nav.security.mock.oauth2.token.DefaultOAuth2TokenCallback
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
internal class ApplicationTest {

    val mockOAuth2 = MockOAuth2Server().apply { start(6666) }
    var engine = TestApplicationEngine(applicationEngineEnvironment(ApplicationContext(ConfigFactory.load("applicationTest.conf"))))
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
        val token: SignedJWT = mockOAuth2.issueToken(
            "lokalissuer", "thisapp", DefaultOAuth2TokenCallback(
                claims = mapOf(
                    "acr" to "Level4",
                    "pid" to "12321",
                    "aud" to "thisapp"
                )
            )
        )
        mockOAuth2.enqueueCallback(
            DefaultOAuth2TokenCallback(
                issuerId = "lokalissuer",
                subject = "foo"
            )
        )

        engine.handleRequest(HttpMethod.Post, "/pdl") {
            //addHeader(HttpHeaders.Authorization, "Bearer " + token.serialize())

        }
            .apply {
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
