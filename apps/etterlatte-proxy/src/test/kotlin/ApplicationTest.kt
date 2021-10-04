package no.nav.etterlatte

import com.typesafe.config.ConfigFactory
import io.ktor.config.HoconApplicationConfig
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.server.testing.createTestEnvironment
import io.ktor.server.testing.handleRequest
import io.ktor.server.testing.withApplication
import org.junit.Test
import org.junit.jupiter.api.Assertions.assertEquals

class ApplicationTest {

    private val testEnv = createTestEnvironment {
        config = HoconApplicationConfig(ConfigFactory.load())
    }

    @Test
    fun testRoot() {
        withApplication(testEnv) {
            handleRequest(HttpMethod.Get, "internal/is_alive").apply {
                assertEquals(HttpStatusCode.OK, response.status())
                assertEquals("Alive", response.content)
            }
        }
    }
    @Test
    fun testKodeverk() {
        withApplication(testEnv) {
            handleRequest(HttpMethod.Get, "tokenx/kodeverk").apply {
                assertEquals(HttpStatusCode.Unauthorized, response.status())
            }
        }
    }
    @Test
    fun testDok() {
        withApplication(testEnv) {
            handleRequest(HttpMethod.Post, "aad/dok").apply {
                assertEquals(HttpStatusCode.Unauthorized, response.status())
            }
        }
    }
}
