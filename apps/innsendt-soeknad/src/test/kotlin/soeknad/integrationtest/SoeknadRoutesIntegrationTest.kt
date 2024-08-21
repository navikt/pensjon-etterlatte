import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import com.nimbusds.jwt.JWTClaimsSet
import com.nimbusds.jwt.PlainJWT
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
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
import io.ktor.server.testing.TestApplicationCall
import io.ktor.server.testing.TestApplicationRequest
import io.ktor.server.testing.TestApplicationResponse
import io.ktor.server.testing.handleRequest
import io.ktor.server.testing.setBody
import io.ktor.server.testing.withTestApplication
import io.mockk.Runs
import io.mockk.coEvery
import io.mockk.every
import io.mockk.just
import io.mockk.mockk
import io.mockk.verify
import no.nav.etterlatte.DataSourceBuilder
import no.nav.etterlatte.UtkastPubliserer
import no.nav.etterlatte.adressebeskyttelse.AdressebeskyttelseService
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadRequest
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.libs.utils.test.InnsendtSoeknadFixtures
import no.nav.etterlatte.soeknad.SoeknadService
import no.nav.etterlatte.soeknad.SoeknadService2
import no.nav.etterlatte.soeknad.soknadApi
import no.nav.etterlatte.toJson
import no.nav.security.token.support.core.context.TokenValidationContext
import no.nav.security.token.support.core.jwt.JwtToken
import no.nav.security.token.support.v2.TokenValidationContextPrincipal
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.MethodOrderer
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Order
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.TestMethodOrder
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import soeknad.LagretSoeknad
import soeknad.PostgresSoeknadRepository
import soeknad.Status
import java.util.*
import java.util.stream.Collectors


@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(OrderAnnotation::class)
internal abstract class SoeknadIntegrationTest {
	@Container
	val postgreSQLContainer = PostgreSQLContainer<Nothing>("postgres:14")
	lateinit var db: PostgresSoeknadRepository
	lateinit var dsbHolder: DataSourceBuilder

	lateinit var service: SoeknadService
	lateinit var service2: SoeknadService2

	val kilde = "omstillingsstoenad-ui"
	val dummyKladd = """{"harSamtykket":"true"}"""
	val mapper = jacksonObjectMapper()
	val mockUtkastPubliserer = mockk<UtkastPubliserer>()

	// TODO mock klient istedet for å teste AdressebeskyttelseService
	val adressebeskyttelse = mockk<AdressebeskyttelseService>().apply {
		coEvery { hentGradering(any(), any()) } returns emptyMap()
	}

	@BeforeAll
	fun beforeAll() {
		val (_, dsb) = opprettInMemoryDatabase(postgreSQLContainer)
		dsbHolder = dsb
		db = PostgresSoeknadRepository.using(dsb.dataSource)

		service = SoeknadService(db, mockUtkastPubliserer)
		service2 = SoeknadService2(service, adressebeskyttelse)
	}

	@AfterAll
	fun afterAll() {
		postgreSQLContainer.stop()
	}
}

internal class SoeknadApiIntegrationTest : SoeknadIntegrationTest() {

	// TODO skal filtrere basert på adressbeskyttelse..

	// TODO Skal publisere slett fra min side

	// TODO skal feile hvis søknad allerede sendt inn

	// TODO skal kaste 500 ??

	// TODO feile hvis innsender ikke er innlogget

	// TODO skal returnere conflict om allerede innsendt

	// TODO skal man få lagre hvis allerede innsendt??


}

fun Application.apiTestModule(routes: Route.() -> Unit) {
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

fun TestApplicationRequest.tokenFor(fnr: String) {
	addHeader(
		HttpHeaders.Authorization,
		"""Bearer ${
			PlainJWT(
				JWTClaimsSet
					.Builder()
					.claim("pid", fnr)
					.issuer("lol")
					.build()
			).serialize()
		}"""
	)
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