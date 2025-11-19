package soeknad.integrationtest

import SoeknadIntegrationTest
import apiTestModule
import com.fasterxml.jackson.module.kotlin.readValue
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import io.ktor.client.request.delete
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.client.request.parameter
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.server.testing.testApplication
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
import soeknad.addToken
import tokenFor

internal class KladdOgSoeknadTest : SoeknadIntegrationTest() {
    companion object {
        private const val STOR_SNERK = "11057523044"
        private const val UKJENT = "16448705149"
    }

    @Test
    @Order(1)
    fun `Skal returnere not found hvis en kladd ikke eksisterer`() {
        testApplication {
            application {
                apiTestModule { soknadApi(service) }
            }

            val response =
                client.get("/api/kladd") {
                    parameter("kilde", kilde)
                    addToken(STOR_SNERK) // LUGUBER MASKIN
                }

            response.status shouldBe HttpStatusCode.NotFound
        }
    }

    @Test
    @Order(2)
    fun `Skal lagre kladd ned i databasen`() {
        db.finnKladd(STOR_SNERK, kilde) shouldBe null
        every { mockUtkastPubliserer.publiserOpprettUtkastTilMinSide(any(), any()) } returns Unit

        testApplication {
            application {
                apiTestModule { soknadApi(service) }
            }

            val response =
                client.post("/api/kladd") {
                    parameter("kilde", kilde)
                    header(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                    addToken(STOR_SNERK)
                    setBody(dummyKladd)
                }

            response.status shouldBe HttpStatusCode.OK

            val kladd = db.finnKladd(STOR_SNERK, kilde)
            kladd shouldNotBe null
            kladd?.id shouldNotBe null
            kladd?.fnr shouldBe STOR_SNERK
            kladd?.payload shouldBe dummyKladd
        }
    }

    @Test
    @Order(3)
    fun `Skal hente kladd fra databasen`() {
        db.finnKladd(STOR_SNERK, kilde) shouldNotBe null

        testApplication {
            application {
                apiTestModule { soknadApi(service) }
            }

            val response =
                client.get("/api/kladd") {
                    parameter("kilde", kilde)
                    addToken(STOR_SNERK)
                }

            response.status shouldBe HttpStatusCode.OK

            val content: LagretSoeknad = mapper.readValue(response.bodyAsText())
            content.payload shouldBe dummyKladd
            content.fnr shouldBe STOR_SNERK
        }
    }

    @Test
    @Order(4)
    fun `Skal slette kladd fra databasen`() {
        db.finnKladd(STOR_SNERK, kilde) shouldNotBe null
        every { mockUtkastPubliserer.publiserSlettUtkastFraMinSide(any(), any()) } returns Unit

        testApplication {
            application {
                apiTestModule { soknadApi(service) }
            }

            val response =
                client.delete("/api/kladd") {
                    parameter("kilde", kilde)
                    addToken(STOR_SNERK)
                }

            response.status shouldBe HttpStatusCode.OK
            db.finnKladd(STOR_SNERK, kilde) shouldBe null
            coVerify { mockUtkastPubliserer.publiserSlettUtkastFraMinSide(STOR_SNERK, 1L) }
        }
    }

    @Test
    @Order(5)
    fun `Kladd som sendes inn som soeknad maa tilhoere innlogget bruker`() {
        testApplication {
            application {
                apiTestModule { soknadApi(service) }
            }

            val response =
                client.post("/api/soeknad") {
                    parameter("kilde", kilde)
                    header(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                    addToken(UKJENT)
                    setBody(
                        SoeknadRequest(
                            soeknader =
                                listOf(
                                    InnsendtSoeknadFixtures.omstillingsSoeknad(
                                        innsenderFnr = Foedselsnummer.of(STOR_SNERK),
                                    ),
                                ),
                        ).toJson(),
                    )
                }

            response.status shouldBe HttpStatusCode.InternalServerError
        }
    }

    @Test
    @Order(6)
    fun `Skal ikke hente kladd etter soeknad er sendt inn`() {
        testApplication {
            application {
                apiTestModule { soknadApi(service) }
            }

            client.post("/api/soeknad") {
                parameter("kilde", kilde)
                header(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                addToken(STOR_SNERK)
                setBody(
                    SoeknadRequest(
                        soeknader =
                            listOf(
                                InnsendtSoeknadFixtures.omstillingsSoeknad(
                                    innsenderFnr = Foedselsnummer.of(STOR_SNERK),
                                ),
                            ),
                    ).toJson(),
                )
            }

            val response =
                client.get("/api/kladd") {
                    parameter("kilde", kilde)
                    addToken(STOR_SNERK)
                }

            response.status shouldBe HttpStatusCode.Conflict
        }
    }

    @Test
    @Order(7)
    fun `Skal ikke kunne lagre endringer på kladd etter soeknad er sendt inn`() {
        testApplication {
            application {
                apiTestModule { soknadApi(service) }
            }

            val response =
                client.post("/api/kladd") {
                    parameter("kilde", kilde)
                    header(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                    addToken(STOR_SNERK)
                    setBody(dummyKladd)
                }

            response.status shouldBe HttpStatusCode.InternalServerError
        }
    }
}