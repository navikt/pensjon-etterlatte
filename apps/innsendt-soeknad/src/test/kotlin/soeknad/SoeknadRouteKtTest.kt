package soeknad

import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.nimbusds.jwt.JWTClaimsSet
import com.nimbusds.jwt.PlainJWT
import io.ktor.client.request.HttpRequestBuilder
import io.ktor.client.request.delete
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.client.request.parameter
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.Headers
import io.ktor.http.HttpHeaders
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
import io.ktor.server.testing.testApplication
import io.mockk.Runs
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.every
import io.mockk.just
import io.mockk.mockk
import no.nav.etterlatte.common.toJson
import no.nav.etterlatte.deserialize
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadRequest
import no.nav.etterlatte.libs.utils.test.InnsendtSoeknadFixtures
import no.nav.etterlatte.soeknad.SoeknadService
import no.nav.etterlatte.soeknad.soknadApi
import no.nav.security.token.support.core.context.TokenValidationContext
import no.nav.security.token.support.core.jwt.JwtToken
import no.nav.security.token.support.v2.TokenValidationContextPrincipal
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.util.Arrays
import java.util.stream.Collectors

internal class SoeknadRouteKtTest {
    private val service = mockk<SoeknadService>()
    private val dummyJson = """{"dummy":"json"}"""
    private val kilde = "omstillingsstoenad-ui"

    companion object {
        private const val STOR_SNERK = "11057523044"
    }

    @Test
    fun `Skal lagre søknader`() {
        val soeknad =
            SoeknadRequest(
                listOf(
                    InnsendtSoeknadFixtures.omstillingsSoeknad(),
                ),
            )

        testApplication {
            application {
                testModule { soknadApi(service) }
            }

            coEvery { service.sendSoeknad(any(), any(), kilde) } returns true

            val response =
                client.post("/api/soeknad") {
                    parameter("kilde", kilde)
                    header(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                    addToken(STOR_SNERK)
                    setBody(soeknad.toJson())
                }

            assertEquals(HttpStatusCode.OK, response.status)
            coVerify(exactly = 1) { service.sendSoeknad(any(), any(), kilde) }
        }
    }

    @Test
    fun `Skal lagre kladd`() {
        testApplication {
            application {
                testModule { soknadApi(service) }
            }

            every { service.lagreKladd(any(), any(), kilde) } returns 1L

            val response =
                client.post("/api/kladd") {
                    parameter("kilde", kilde)
                    header(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                    addToken(STOR_SNERK)
                    setBody(dummyJson)
                }

            assertEquals(HttpStatusCode.OK, response.status)
            assertEquals("1", response.bodyAsText())
            coVerify(exactly = 1) { service.lagreKladd(any(), any(), kilde) }
        }
    }

    @Test
    fun `Skal hente kladd`() {
        testApplication {
            application {
                testModule { soknadApi(service) }
            }

            val kladd = LagretSoeknad(1L, "", "").apply { status = Status.LAGRETKLADD }
            coEvery { service.hentKladd(any(), kilde) } returns kladd

            val response =
                client.get("api/kladd") {
                    parameter("kilde", kilde)
                    addToken(STOR_SNERK)
                }

            assertEquals(HttpStatusCode.OK, response.status)
            assertEquals(kladd, deserialize<LagretSoeknad>(response.bodyAsText()))
            coVerify(exactly = 1) { service.hentKladd(any(), kilde) }
        }
    }

    @Test
    fun `Skal håndtere at kladd ikke finnes`() {
        testApplication {
            application {
                testModule { soknadApi(service) }
            }

            coEvery { service.hentKladd(any(), kilde) } returns null

            val response =
                client.get("api/kladd") {
                    parameter("kilde", kilde)
                    addToken(STOR_SNERK)
                }

            assertEquals(HttpStatusCode.NotFound, response.status)
            coVerify(exactly = 1) { service.hentKladd(any(), kilde) }
        }
    }

    @Test
    fun `Skal slette kladd`() {
        testApplication {
            application {
                testModule { soknadApi(service) }
            }
            coEvery { service.slettKladd(any(), kilde) } just Runs
            val response =
                client.delete("api/kladd") {
                    parameter("kilde", kilde)
                    addToken(STOR_SNERK)
                }

            assertEquals(HttpStatusCode.OK, response.status)
            coVerify(exactly = 1) { service.slettKladd(any(), kilde) }
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

class TokenSupportAcceptAllProvider : AuthenticationProvider(ProviderConfiguration(null)) {
    class ProviderConfiguration internal constructor(
        name: String?,
    ) : Config(name)

    private fun getTokensFromHeader(request: Headers): List<JwtToken> {
        try {
            val authorization = request["Authorization"]
            if (authorization != null) {
                val headerValues = authorization.split(",".toRegex()).toTypedArray()
                return extractBearerTokens(*headerValues)
                    .map { encodedToken: String ->
                        JwtToken(
                            encodedToken,
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
                        " ".toRegex(),
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
                TokenValidationContext(getTokensFromHeader(context.call.request.headers).associateBy { it.issuer }),
            ),
        )
    }
}

fun AuthenticationConfig.tokenTestSupportAcceptsAllTokens() = register(TokenSupportAcceptAllProvider())

fun HttpRequestBuilder.addToken(fnr: String) {
    header(
        HttpHeaders.Authorization,
        """Bearer ${
            PlainJWT(
                JWTClaimsSet
                    .Builder()
                    .claim("pid", fnr)
                    .issuer("lol")
                    .build(),
            ).serialize()
        }""",
    )
}