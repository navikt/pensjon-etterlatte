package soeknad.integrationtest

import SoeknadIntegrationTest
import apiTestModule
import com.fasterxml.jackson.module.kotlin.readValue
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.server.testing.handleRequest
import io.ktor.server.testing.setBody
import io.ktor.server.testing.withTestApplication
import io.mockk.coVerify
import io.mockk.every
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadRequest
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.libs.utils.test.InnsendtSoeknadFixtures
import no.nav.etterlatte.soeknad.soknadApi
import no.nav.etterlatte.toJson
import org.junit.jupiter.api.Order
import org.junit.jupiter.api.Test
import soeknad.LagretSoeknad
import tokenFor

internal class KladdOgSoeknadTest: SoeknadIntegrationTest() {
    companion object {
        private const val STOR_SNERK = "11057523044"
        private const val UKJENT = "16448705149"
    }

    @Test
    @Order(1)
    fun `Skal returnere not found hvis en kladd ikke eksisterer`() {
        withTestApplication({ apiTestModule { soknadApi(service) } }) {
            handleRequest(HttpMethod.Get, "/api/kladd?kilde=$kilde") {
                tokenFor(STOR_SNERK) // LUGUBER MASKIN
            }.apply {
                response.status() shouldBe HttpStatusCode.NotFound
            }
        }
    }

    @Test
    @Order(2)
    fun `Skal lagre kladd ned i databasen`() {
        db.finnKladd(STOR_SNERK, kilde) shouldBe null
        every { mockUtkastPubliserer.publiserOpprettUtkastTilMinSide(any(), any()) } returns Unit

        withTestApplication({ apiTestModule { soknadApi(service) } }) {
            handleRequest(HttpMethod.Post, "/api/kladd?kilde=$kilde") {
                addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                tokenFor(STOR_SNERK)
                setBody(dummyKladd)
            }.apply {
                response.status() shouldBe HttpStatusCode.OK

                val kladd = db.finnKladd(STOR_SNERK, kilde)
                kladd shouldNotBe null
                kladd?.id shouldNotBe null
                kladd?.fnr shouldBe STOR_SNERK
                kladd?.payload shouldBe dummyKladd
            }
        }
    }

    @Test
    @Order(3)
    fun `Skal hente kladd fra databasen`() {
        db.finnKladd(STOR_SNERK, kilde) shouldNotBe null

        withTestApplication({ apiTestModule { soknadApi(service) } }) {
            handleRequest(HttpMethod.Get, "/api/kladd?kilde=$kilde") {
                tokenFor(STOR_SNERK)
            }.apply {
                response.status() shouldBe HttpStatusCode.OK

                val content: LagretSoeknad = mapper.readValue(response.content!!)
                content.payload shouldBe dummyKladd
                content.fnr shouldBe STOR_SNERK
            }
        }
    }

    @Test
    @Order(4)
    fun `Skal slette kladd fra databasen`() {
        db.finnKladd(STOR_SNERK, kilde) shouldNotBe null
        every { mockUtkastPubliserer.publiserSlettUtkastFraMinSide(any(), any()) } returns Unit

        withTestApplication({ apiTestModule { soknadApi(service) } }) {
            handleRequest(HttpMethod.Delete, "/api/kladd?kilde=$kilde") {
                tokenFor(STOR_SNERK)
            }.apply {
                response.status() shouldBe HttpStatusCode.OK
                db.finnKladd(STOR_SNERK, kilde) shouldBe null
                coVerify { mockUtkastPubliserer.publiserSlettUtkastFraMinSide(STOR_SNERK, 1L) }
            }
        }
    }

    @Test
    @Order(5)
    fun `Kladd som sendes inn som soeknad maa tilhoere innlogget bruker`() {
        withTestApplication({ apiTestModule { soknadApi(service) } }) {
            handleRequest(HttpMethod.Post, "/api/soeknad?kilde=$kilde") {
                addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                tokenFor(UKJENT)
                setBody(
                    SoeknadRequest(
                        soeknader = listOf(
                            InnsendtSoeknadFixtures.omstillingsSoeknad(
                                innsenderFnr = Foedselsnummer.of(STOR_SNERK),
                            )
                        )
                    ).toJson()
                )
            }.apply {
                response.status() shouldBe HttpStatusCode.InternalServerError
            }
        }
    }

    @Test
    @Order(6)
    fun `Skal ikke hente kladd etter soeknad er sendt inn`() {
        withTestApplication({ apiTestModule { soknadApi(service) } }) {
            handleRequest(HttpMethod.Post, "/api/soeknad?kilde=$kilde") {
                addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                tokenFor(STOR_SNERK)
                setBody(
                    SoeknadRequest(
                        soeknader = listOf(
                            InnsendtSoeknadFixtures.omstillingsSoeknad(
                                innsenderFnr = Foedselsnummer.of(STOR_SNERK),
                            )
                        )
                    ).toJson()
                )
            }

            handleRequest(HttpMethod.Get, "/api/kladd?kilde=$kilde") {
                tokenFor(STOR_SNERK)
            }.apply {
                response.status() shouldBe HttpStatusCode.Conflict
            }
        }
    }

    @Test
    @Order(7)
    fun `Skal ikke kunne lagre endringer på kladd etter soeknad er sendt inn`() {

        withTestApplication({ apiTestModule { soknadApi(service) } }) {
            handleRequest(HttpMethod.Post, "/api/kladd?kilde=$kilde") {
                addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                tokenFor(STOR_SNERK)
                setBody(dummyKladd)
            }.apply {
                response.status() shouldBe HttpStatusCode.InternalServerError
            }
        }
    }


}