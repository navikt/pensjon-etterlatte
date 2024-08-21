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
import io.mockk.every
import no.nav.etterlatte.soeknad.soknadApi
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Order
import org.junit.jupiter.api.Test
import soeknad.LagretSoeknad
import tokenFor

@DisplayName("Som innsender av søknad skal jeg bruke kladd")
internal class KladdIntegrationTest : SoeknadIntegrationTest() {
	companion object {
		private const val STOR_SNERK = "11057523044"
	}

	@Test
	@Order(1)
	fun `Skal returnere not found hvis en kladd ikke eksisterer`() {
		withTestApplication({ apiTestModule { soknadApi(service2) } }) {
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

		withTestApplication({ apiTestModule { soknadApi(service2) } }) {
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

		withTestApplication({ apiTestModule { soknadApi(service2) } }) {
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
		//every { mockUtkastPubliserer.publiserSlettUtkastFraMinSide(any(), any()) } returns Unit

		withTestApplication({ apiTestModule { soknadApi(service2) } }) {
			handleRequest(HttpMethod.Delete, "/api/kladd?kilde=$kilde") {
				tokenFor(STOR_SNERK)
			}.apply {
				response.status() shouldBe HttpStatusCode.OK
				db.finnKladd(STOR_SNERK, kilde) shouldBe null
			}
		}
	}

}