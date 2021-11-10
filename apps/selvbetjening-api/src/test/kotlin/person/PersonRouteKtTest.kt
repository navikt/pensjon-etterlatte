package person

import io.ktor.application.*
import io.ktor.http.*
import io.ktor.routing.*
import io.ktor.server.testing.*
import io.mockk.coEvery
import io.mockk.mockk
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.person.PersonService
import no.nav.etterlatte.person.personApi
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test


class PersonRouteKtTest {
    private val service = mockk<PersonService>()
    private val fnr = Foedselsnummer.of("19040550081")

    @Test
    fun `Skal returnere HttpStatus OK når person med fnr eksisterer`() {
        withTestApplication({ testModule { personApi(service) } }) {
            coEvery { service.gyldigFnr(fnr) } returns true
            handleRequest(HttpMethod.Get, "/person/gyldig/${fnr.value}").apply {
                assertEquals(HttpStatusCode.OK, response.status())
            }
        }
    }

    @Test
    fun `Skal returnere HttpStatus NotFound når person med fnr ikke eksisterer`() {
        withTestApplication({ testModule { personApi(service) } }) {
            coEvery { service.gyldigFnr(fnr) } returns false
            handleRequest(HttpMethod.Get, "/person/gyldig/${fnr.value}").apply {
                assertEquals(HttpStatusCode.NotFound, response.status())
            }
        }
    }

    @Test
    fun `Skal returnere HttpStatus NotFound når fnr ikke er gyldig`() {
        withTestApplication({ testModule { personApi(service) } }) {
            coEvery { service.gyldigFnr(fnr) } returns false
            handleRequest(HttpMethod.Get, "/person/gyldig/123UGYLDIGFNR").apply {
                assertEquals(HttpStatusCode.NotFound, response.status())
            }
        }
    }
}

fun Application.testModule(routes: Route.() -> Unit) {
    routing {
        routes()
    }
}
