package soeknad

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.ktor.client.statement.HttpResponse
import io.ktor.http.ContentType
import io.ktor.http.Headers
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.serialization.jackson.jackson
import io.ktor.server.application.Application
import io.ktor.server.application.install
import io.ktor.server.auth.Authentication
import io.ktor.server.auth.AuthenticationConfig
import io.ktor.server.auth.AuthenticationContext
import io.ktor.server.auth.AuthenticationProvider
import io.ktor.server.auth.authenticate
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.routing.IgnoreTrailingSlash
import io.ktor.server.routing.Route
import io.ktor.server.routing.routing
import io.ktor.server.testing.handleRequest
import io.ktor.server.testing.setBody
import io.ktor.server.testing.withTestApplication
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.mockk
import libs.common.util.RetryResult
import no.nav.etterlatte.common.toJson
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadRequest
import no.nav.etterlatte.libs.utils.test.InnsendtSoeknadFixtures
import no.nav.etterlatte.soeknad.SoeknadService2
import no.nav.etterlatte.soeknad.soknadApi
import no.nav.security.token.support.core.context.TokenValidationContext
import no.nav.security.token.support.core.jwt.JwtToken
import no.nav.security.token.support.v2.TokenValidationContextPrincipal
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import tokenFor
import java.util.*
import java.util.stream.*

internal class SoeknadRouteKtTest {
	private val service = mockk<SoeknadService2>()
	private val dummyJson = """{"dummy":"json"}"""
	private val kilde = "omstillingsstoenad-ui"
	private val STOR_SNERK = "11057523044"

	@Test
	fun `Skal lagre søknader`() {
		val soeknad =
			SoeknadRequest(
				listOf(
					InnsendtSoeknadFixtures.omstillingsSoeknad()
				)
			)

		withTestApplication({ testModule { soknadApi(service) } }) {
			coEvery { service.sendSoeknader(any(), any(), kilde) } returns HttpStatusCode.OK
			handleRequest(HttpMethod.Post, "/api/soeknad?kilde=$kilde") {
				addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
				tokenFor(STOR_SNERK)
				setBody(soeknad.toJson())
			}.apply {
				assertEquals(HttpStatusCode.OK, response.status())
				coVerify(exactly = 1) { service.sendSoeknader(any(), any(), kilde) }
			}
		}
	}

	@Test
	fun `Skal lagre kladd`() {
		withTestApplication({ testModule { soknadApi(service) } }) {
			coEvery { service.lagreKladd(any(), any(), kilde) } returns RetryResult.Success(1)
			handleRequest(HttpMethod.Post, "/api/kladd?kilde=$kilde") {
				addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
				tokenFor(STOR_SNERK)
				setBody(dummyJson)
			}.apply {
				assertEquals(HttpStatusCode.OK, response.status())
				assertEquals("1", response.content)
				coVerify(exactly = 1) { service.lagreKladd(any(), any(), kilde) }
			}
		}
	}

	@Test
	fun `Skal hente kladd`() {
		withTestApplication({ testModule { soknadApi(service) } }) {
			coEvery { service.hentKladd(any(), kilde) } returns RetryResult.Success(
				jacksonObjectMapper().readTree(
					dummyJson
				)
			)
			handleRequest(HttpMethod.Get, "/api/kladd?kilde=$kilde") {
				tokenFor(STOR_SNERK)
			}.apply {
				assertEquals(HttpStatusCode.OK, response.status())
				assertEquals(dummyJson, response.content)
				coVerify(exactly = 1) { service.hentKladd(any(), kilde) }
			}
		}
	}

	@Test
	fun `Skal håndtere at kladd ikke finnes`() {
		withTestApplication({ testModule { soknadApi(service) } }) {
			coEvery { service.hentKladd(any(), kilde) } returns RetryResult.Success(HttpStatusCode.NotFound)
			handleRequest(HttpMethod.Get, "/api/kladd?kilde=$kilde") {
				tokenFor(STOR_SNERK)
			}.apply {
				assertEquals(HttpStatusCode.NotFound, response.status())
				coVerify(exactly = 1) { service.hentKladd(any(), kilde) }
			}
		}
	}

	@Test
	fun `Skal slette kladd`() {
		withTestApplication({ testModule { soknadApi(service) } }) {
			coEvery { service.slettKladd(any(), kilde) } returns RetryResult.Success(HttpStatusCode.OK)
			handleRequest(HttpMethod.Delete, "/api/kladd?kilde=$kilde") {
				tokenFor(STOR_SNERK)
			}.apply {
				assertEquals(HttpStatusCode.OK, response.status())
				coVerify(exactly = 1) { service.slettKladd(any(), kilde) }
			}
		}
	}
}

fun Application.testModule(routes: Route.() -> Unit) {
	install(ContentNegotiation) {
		jackson {
			registerModule(JavaTimeModule())
		}
	}
	install(IgnoreTrailingSlash)
	install(Authentication) {
		tokenTestSupportAcceptsAllTokens()
	}

	routing {
		authenticate {
			routes()
		}
	}
}

class TokenSupportAcceptAllProvider: AuthenticationProvider(ProviderConfiguration(null)) {
	class ProviderConfiguration internal constructor(
		name: String?
	): Config(name)

	private fun getTokensFromHeader(request: Headers): List<JwtToken> {
		try {
			val authorization = request["Authorization"]
			if (authorization != null) {
				val headerValues = authorization.split(",".toRegex()).toTypedArray()
				return extractBearerTokens(*headerValues)
					.map { encodedToken: String ->
						JwtToken(
							encodedToken
						)
					}
			}
		} catch (_: Exception) {
		}
		return emptyList()
	}

	private fun extractBearerTokens(vararg headerValues: String): List<String> =
		Arrays
			.stream(headerValues)
			.map { s: String ->
				s
					.split(
						" ".toRegex()
					).toTypedArray()
			}.filter { pair: Array<String> -> pair.size == 2 }
			.filter { pair: Array<String> ->
				pair[0]
					.trim { it <= ' ' }
					.equals("Bearer", ignoreCase = true)
			}.map { pair: Array<String> ->
				pair[1].trim { it <= ' ' }
			}.collect(Collectors.toList())

	override suspend fun onAuthenticate(context: AuthenticationContext) {
		context.principal(
			TokenValidationContextPrincipal(
				TokenValidationContext(getTokensFromHeader(context.call.request.headers).associateBy { it.issuer })
			)
		)
	}
}

fun AuthenticationConfig.tokenTestSupportAcceptsAllTokens() = register(TokenSupportAcceptAllProvider())