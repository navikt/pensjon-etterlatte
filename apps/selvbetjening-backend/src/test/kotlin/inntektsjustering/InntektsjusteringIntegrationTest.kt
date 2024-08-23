package inntektsjustering

import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.readValue
import com.nimbusds.jwt.JWTClaimsSet
import com.nimbusds.jwt.PlainJWT
import io.kotest.matchers.shouldBe
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
import io.ktor.server.testing.TestApplicationRequest
import io.ktor.server.testing.handleRequest
import io.ktor.server.testing.setBody
import io.ktor.server.testing.withTestApplication
import io.mockk.every
import io.mockk.mockk
import no.nav.etterlatte.DataSourceBuilder
import no.nav.etterlatte.inntektsjustering.InntektsjusteringLagre
import no.nav.etterlatte.inntektsjustering.InntektsjusteringRepository
import no.nav.etterlatte.inntektsjustering.InntektsjusteringService
import no.nav.etterlatte.inntektsjustering.inntektsjustering
import no.nav.etterlatte.kafka.KafkaProdusent
import no.nav.etterlatte.libs.common.inntektsjustering.Inntektsjustering
import no.nav.etterlatte.mapper
import no.nav.etterlatte.toJson
import no.nav.security.token.support.core.context.TokenValidationContext
import no.nav.security.token.support.core.jwt.JwtToken
import no.nav.security.token.support.v2.TokenValidationContextPrincipal
import opprettInMemoryDatabase
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.MethodOrderer
import org.junit.jupiter.api.Order
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.TestMethodOrder
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import java.time.LocalDateTime
import java.time.ZoneId
import java.util.Arrays
import java.util.stream.Collectors

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation::class)
internal class InntektsjusteringIntegrationTest {
    @Container
    private val postgreSQLContainer = PostgreSQLContainer<Nothing>("postgres:14")
    private lateinit var db: InntektsjusteringRepository
    private lateinit var dsbHolder: DataSourceBuilder
    private lateinit var service: InntektsjusteringService

    private val rapid = mockk<KafkaProdusent<String, String>>() {
        // TODO..
        every { publiser(any(), any()) } returns mockk()
    }

    @BeforeAll
    fun beforeAll() {
        val (_, dsb) = opprettInMemoryDatabase(postgreSQLContainer)
        dsbHolder = dsb
        db = InntektsjusteringRepository(dsb.dataSource)

        service = InntektsjusteringService(db, rapid)
    }

    @AfterAll
    fun afterAll() {
        postgreSQLContainer.stop()
    }

    @Test
    @Order(1)
    fun `Skal hente inntektsjustering og få 404`() {
        withTestApplication({ apiTestModule { inntektsjustering(service) } }) {
            val call = handleRequest(HttpMethod.Get, "/api/inntektsjustering") {
                addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                tokenFor(VAKKER_PENN)
            }
            call.response.status() shouldBe HttpStatusCode.NotFound
        }
    }

    @Test
    @Order(2)
    fun `Skal lagre inntektjustering`() {
        withTestApplication({ apiTestModule { inntektsjustering(service) } }) {
            val json = """{
				"${InntektsjusteringLagre::arbeidsinntekt.name}":300,
				"${InntektsjusteringLagre::naeringsinntekt.name}":400,
				"${InntektsjusteringLagre::arbeidsinntektUtland.name}":100,
				"${InntektsjusteringLagre::naeringsinntektUtland.name}":200
				}""".trimIndent()
            val call = handleRequest(HttpMethod.Post, "/api/inntektsjustering") {
                addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                tokenFor(VAKKER_PENN)
                setBody(json)
            }
            call.response.status() shouldBe HttpStatusCode.OK
        }
    }

    @Test
    @Order(2)
    fun `Skal hente lagret inntektsjustering`() {
        withTestApplication({ apiTestModule { inntektsjustering(service) } }) {
            val call = handleRequest(HttpMethod.Get, "/api/inntektsjustering") {
                addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                tokenFor(VAKKER_PENN)
            }
            call.response.status() shouldBe HttpStatusCode.OK

            val content: Inntektsjustering = mapper.readValue(call.response.content!!)
            with(content) {
                arbeidsinntekt shouldBe nyInntektsjustering.arbeidsinntekt
                naeringsinntekt shouldBe nyInntektsjustering.naeringsinntekt
                arbeidsinntektUtland shouldBe nyInntektsjustering.arbeidsinntektUtland
                naeringsinntektUtland shouldBe nyInntektsjustering.naeringsinntektUtland
                LocalDateTime.now().let { naa ->
                    tidspunkt.atZone(ZoneId.of("UTC")).let {
                        it.year shouldBe naa.year
                        it.month shouldBe naa.month
                        it.dayOfMonth shouldBe naa.dayOfMonth
                    }
                }
            }
        }
    }

    @Test
    @Order(3)
    fun `Skal hente nyligste inntektsjustering`() {
        withTestApplication({ apiTestModule { inntektsjustering(service) } }) {
            handleRequest(HttpMethod.Post, "/api/inntektsjustering") {
                addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                tokenFor(VAKKER_PENN)
                setBody(
                    nyInntektsjustering.copy(
                        arbeidsinntekt = 123
                    ).toJson()
                )
            }

            val call = handleRequest(HttpMethod.Get, "/api/inntektsjustering") {
                addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                tokenFor(VAKKER_PENN)
            }
            call.response.status() shouldBe HttpStatusCode.OK

            val content: Inntektsjustering = mapper.readValue(call.response.content!!)
            content.arbeidsinntekt shouldBe 123
        }
    }

    companion object {
        private const val VAKKER_PENN = "09038520129"
        private val nyInntektsjustering = InntektsjusteringLagre(
            arbeidsinntekt = 300,
            naeringsinntekt = 400,
            arbeidsinntektUtland = 100,
            naeringsinntektUtland = 200
        )
    }

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
