package no.nav.etterlatte.person

import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.client.request.parameter
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.server.testing.testApplication
import io.mockk.clearMocks
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.every
import io.mockk.mockk
import io.mockk.mockkObject
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadType
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.fail
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.EnumSource
import soeknad.testModule

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
internal class PersonRouteTest {
    private val service = mockk<PersonService>()

    init {
        mockkObject(Auth)
        every { Auth.innloggetBrukerFnr() } returns Foedselsnummer.of(STOR_SNERK)
    }

    @AfterEach
    fun afterEach() {
        clearMocks(service)
    }

    @ParameterizedTest
    @EnumSource(SoeknadType::class)
    fun `Enkel test av endepunkt`(type: SoeknadType) {
        testApplication {
            application {
                testModule { personApi(service) }
            }

            coEvery { service.hentPerson(any(), any()) } returns
                Person(
                    fornavn = "STOR",
                    etternavn = "SNERK",
                    foedselsnummer = Foedselsnummer.of(STOR_SNERK),
                    adressebeskyttelse = false,
                )

            val response =
                client.get("/person/innlogget") {
                    parameter("soeknadType", type)
                    header(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                }

            Assertions.assertEquals(HttpStatusCode.OK, response.status)
            coVerify(exactly = 1) { service.hentPerson(any(), type) }
        }
    }

    @ParameterizedTest
    @EnumSource(SoeknadType::class)
    fun `Feil i kodeverk kaster riktig feilkode`(type: SoeknadType) {
        testApplication {
            application {
                testModule { personApi(service) }
            }

            coEvery { service.hentPerson(any(), any()) } throws Exception("Ukjent feil")

            runCatching {
                client.get("/person/innlogget") {
                    parameter("soeknadType", type)
                    header(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                }
            }.fold(
                onSuccess = { fail { "Feil i kodeverk skal propagere til frontend" } },
                onFailure = {
                    Assertions.assertNotNull(it)
                },
            )

            coVerify(exactly = 1) { service.hentPerson(any(), type) }
        }
    }

    companion object {
        private const val STOR_SNERK = "11057523044"
    }
}