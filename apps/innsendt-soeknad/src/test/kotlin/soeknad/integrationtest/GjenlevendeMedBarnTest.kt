package soeknad.integrationtest

import SoeknadIntegrationTest
import apiTestModule
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.server.testing.handleRequest
import io.ktor.server.testing.setBody
import io.ktor.server.testing.withTestApplication
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
import tokenFor

@DisplayName("Gjenlevende søker for seg selv og barn")
internal class GjenlevendeMedBarn: SoeknadIntegrationTest() {

	companion object {
		val GJENLEVENDE = "04117120886"
		val BARN = "05111850870"
		val AVDOED = "10459829453"
	}

	@Test
	@Order(1)
	fun `Skal opprette kladd for gjenlevende`() {
		every { mockUtkastPubliserer.publiserSlettUtkastFraMinSide(any(), any()) } returns Unit

		withTestApplication({ apiTestModule { soknadApi(service2) } }) {
			handleRequest(HttpMethod.Post, "/api/kladd?kilde=$kilde") {
				addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
				tokenFor(GJENLEVENDE)
				setBody(dummyKladd)
			}

			db.finnKladd(GJENLEVENDE, kilde) shouldNotBe null
			db.finnKladd(BARN, kilde) shouldBe null
		}
	}


	@Test
	@Order(2)
	fun `Skal opprette soeknad for gjenlevende og for barn`() {
		every { mockUtkastPubliserer.publiserSlettUtkastFraMinSide(any(), any()) } just Runs

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
					)

				)
			)

		withTestApplication({ apiTestModule { soknadApi(service2) } }) {
			handleRequest(HttpMethod.Post, "/api/soeknad?kilde=$kilde") {
				addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
				tokenFor(GJENLEVENDE)
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
		db.finnKladd(BARN, kilde) shouldBe null
	}

}
