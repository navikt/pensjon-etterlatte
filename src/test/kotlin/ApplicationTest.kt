package no.pensjon

import io.ktor.http.*
import kotlin.test.*
import io.ktor.server.testing.*
import no.pensjon.etterlatte.module
import org.junit.jupiter.api.Test

class ApplicationTest {
    @Test
    fun testRoot() {
        withTestApplication({ module(testing = true) }) {
            handleRequest(HttpMethod.Get, "/").apply {
                assertEquals(HttpStatusCode.OK, response.status())
            }
        }
    }
}
