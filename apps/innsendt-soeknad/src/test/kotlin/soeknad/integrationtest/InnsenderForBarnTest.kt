package soeknad.integrationtest

import SoeknadIntegrationTest
import apiTestModule
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.server.testing.handleRequest
import io.ktor.server.testing.setBody
import io.ktor.server.testing.withTestApplication
import io.mockk.every
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
import tokenFor

@DisplayName("Innsender av søknad er ikke søker")
internal class KunBarnepensjon: SoeknadIntegrationTest() {

    companion object {
        private const val INNSENDER = "19468741094"
        private const val BARN = "21461297037"
        private const val AVDOED = "16448705149"
    }

    val soeknadRequest =
        SoeknadRequest(
            listOf(
                InnsendtSoeknadFixtures.barnepensjon(
                    innsenderFnr = Foedselsnummer.of(INNSENDER),
                    soekerFnr = Foedselsnummer.of(BARN),
                    avdoed = Foedselsnummer.of(AVDOED)
                )
            )
        )

    @Test
    @Order(1)
    fun `Skal opprette kladd for innsender`() {
        every { mockUtkastPubliserer.publiserSlettUtkastFraMinSide(any(), any()) } returns Unit

        withTestApplication({ apiTestModule { soknadApi(service) } }) {
            handleRequest(HttpMethod.Post, "/api/kladd?kilde=$kilde") {
                addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                tokenFor(INNSENDER)
                setBody(dummyKladd)
            }

            db.finnKladd(INNSENDER, kilde) shouldNotBe null
            db.finnKladd(BARN, kilde) shouldBe null
        }
    }

    @Test
    @Order(2)
    fun `Skal opprette soeknad for barn`() {
        withTestApplication({ apiTestModule { soknadApi(service) } }) {
            handleRequest(HttpMethod.Post, "/api/soeknad?kilde=$kilde") {
                addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                tokenFor(INNSENDER)
                setBody(soeknadRequest.toJson())
            }
        }

        val barnepensjonRow =
            dsbHolder.dataSource.connection
                .createStatement()
                .executeQuery("SELECT * FROM innhold WHERE fnr = '$BARN'")
        barnepensjonRow.next()

        barnepensjonRow.getString("fnr") shouldBe BARN
        barnepensjonRow.getString("payload") shouldBe soeknadRequest.soeknader.last().toJson()
    }

    @Test
    @Order(3)
    fun `Utkast fra MinSide og kladd i database skal slettes for innsender som ikker er søker`() {
        verify { mockUtkastPubliserer.publiserSlettUtkastFraMinSide(INNSENDER, any()) }
        db.finnKladd(INNSENDER, kilde) shouldBe null
    }

    @Test
    @Order(4)
    fun `Barn har ingen kladd eller utkast i MinSide`() {
        verify(exactly = 0) { mockUtkastPubliserer.publiserSlettUtkastFraMinSide(BARN, any()) }
        db.finnKladd(BARN, kilde)!!.status shouldNotBe Status.LAGRETKLADD
    }

    @Test
    @Order(5)
    fun `Skal ikke kunne sende inn soeknad om det allerede finnes en innsendt`() {
        withTestApplication({ apiTestModule { soknadApi(service) } }) {
            handleRequest(HttpMethod.Post, "/api/soeknad?kilde=$kilde") {
                addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                tokenFor(INNSENDER)
                setBody(soeknadRequest.toJson())
            }.apply {
                response.status() shouldBe HttpStatusCode.Conflict
            }
        }
    }


}