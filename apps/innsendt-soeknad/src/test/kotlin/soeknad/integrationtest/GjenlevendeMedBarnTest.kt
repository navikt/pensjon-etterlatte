package soeknad.integrationtest

import SoeknadIntegrationTest
import apiTestModule
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import io.ktor.client.request.header
import io.ktor.client.request.parameter
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.server.testing.testApplication
import io.mockk.Runs
import io.mockk.every
import io.mockk.just
import io.mockk.verify
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadRequest
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.libs.utils.test.InnsendtSoeknadFixtures
import no.nav.etterlatte.soeknad.soknadApi
import no.nav.etterlatte.toJson
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Order
import org.junit.jupiter.api.Test
import soeknad.Status
import soeknad.addToken
import tokenFor

@DisplayName("Gjenlevende søker for seg selv og barn")
internal class GjenlevendeMedBarnTest : SoeknadIntegrationTest() {
    companion object {
        private const val GJENLEVENDE = "04117120886"
        private const val BARN = "05111850870"
        private const val AVDOED = "10459829453"
    }

    val request =
        SoeknadRequest(
            soeknader =
                listOf(
                    InnsendtSoeknadFixtures.omstillingsSoeknad(
                        innsenderFnr = Foedselsnummer.of(GJENLEVENDE),
                        avdoed = Foedselsnummer.of(AVDOED),
                    ),
                    InnsendtSoeknadFixtures.barnepensjon(
                        innsenderFnr = Foedselsnummer.of(GJENLEVENDE),
                        soekerFnr = Foedselsnummer.of(BARN),
                        avdoed = Foedselsnummer.of(AVDOED),
                    ),
                ),
        )

    @Test
    @Order(1)
    fun `Skal opprette kladd for gjenlevende`() {
        every { mockUtkastPubliserer.publiserSlettUtkastFraMinSide(any(), any()) } returns Unit
        testApplication {
            application {
                apiTestModule { soknadApi(service) }
            }

            client.post("api/kladd") {
                parameter("kilde", kilde)
                header(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                addToken(GJENLEVENDE)
                setBody(dummyKladd)
            }
        }

        db.finnKladd(GJENLEVENDE, kilde) shouldNotBe null
        db.finnKladd(BARN, kilde) shouldBe null
    }

    @Test
    @Order(2)
    fun `Skal opprette soeknad for gjenlevende og for barn`() {
        every { mockUtkastPubliserer.publiserSlettUtkastFraMinSide(any(), any()) } just Runs

        testApplication {
            application {
                apiTestModule { soknadApi(service) }
            }

            client.post("api/soeknad") {
                parameter("kilde", kilde)
                header(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                addToken(GJENLEVENDE)
                setBody(request.toJson())
            }
        }

        // Verifiser søknad for gjenlevendepensjon
        val gjenlevendeRow =
            dsbHolder.dataSource.connection
                .createStatement()
                .executeQuery("SELECT * FROM innhold WHERE fnr = '$GJENLEVENDE'")
        gjenlevendeRow.next()

        gjenlevendeRow.getString("fnr") shouldBe GJENLEVENDE
        gjenlevendeRow.getString("payload") shouldBe request.soeknader.first().toJson()

        // Verifiser egen søknad for barnepensjon
        val barnepensjonRow =
            dsbHolder.dataSource.connection
                .createStatement()
                .executeQuery("SELECT * FROM innhold WHERE fnr = '$BARN'")
        barnepensjonRow.next()

        barnepensjonRow.getString("fnr") shouldBe BARN
        barnepensjonRow.getString("payload") shouldBe request.soeknader.last().toJson()
    }

    @Test
    @Order(3)
    fun `Utkast fra MinSide ferdigstiller og kladd i database beholdes for gjenlevende`() {
        verify { mockUtkastPubliserer.publiserSlettUtkastFraMinSide(GJENLEVENDE, any()) }
        val kladd = db.finnKladd(GJENLEVENDE, kilde)
        kladd!!.status shouldBe Status.FERDIGSTILT
    }

    @Test
    @Order(4)
    fun `Barn skal ikke ha kladd`() {
        verify(exactly = 0) { mockUtkastPubliserer.publiserSlettUtkastFraMinSide(BARN, any()) }
        db.finnKladd(BARN, kilde)!!.status shouldNotBe Status.LAGRETKLADD
    }

    @Test
    @Order(5)
    fun `Skal ikke kunne sende inn soeknad om det allerede finnes en innsendt`() {
        testApplication {
            application {
                apiTestModule { soknadApi(service) }
            }

            val response =
                client.post("api/soeknad") {
                    parameter("kilde", kilde)
                    header(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                    addToken(GJENLEVENDE)
                    setBody(request.toJson())
                }

            response.status shouldBe HttpStatusCode.Conflict
        }
    }
}