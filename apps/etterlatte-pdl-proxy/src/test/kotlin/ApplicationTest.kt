package no.nav.etterlatte

import com.typesafe.config.ConfigFactory
import io.ktor.config.HoconApplicationConfig
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.server.testing.TestApplicationEngine
import io.ktor.server.testing.createTestEnvironment
import io.ktor.server.testing.handleRequest
import io.ktor.server.testing.withTestApplication
import org.junit.BeforeClass
import org.junit.jupiter.api.Assertions.assertEquals

class ApplicationTest {

    companion object {
        val engine = TestApplicationEngine(createTestEnvironment {
            config = HoconApplicationConfig(ConfigFactory.load("applicationTest.conf"))
        })

        @BeforeClass
        @JvmStatic fun setup(){
            //logger.debug("Starting application with config ....")
            engine.start(wait = false)
            engine.application.module()

        }


    }
    private val testEnv = createTestEnvironment {
        config = HoconApplicationConfig(ConfigFactory.load("applicationTest.conf"))
    }

    //@Test
    fun testRoot() {
        with(engine) {
            handleRequest(HttpMethod.Get, "internal/is_alive").apply {
                assertEquals(HttpStatusCode.OK, response.status())
                assertEquals("Alive", response.content)
            }
        }
    }
    //@Test
    fun testPDL() {
        withTestApplication({ module() }) {
            handleRequest(HttpMethod.Post, "/tokenx/pdl").apply {
                assertEquals(HttpStatusCode.OK, response.status())
                assertEquals("HELLO WORLD!", response.content)
            }
        }
    }
}
