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
import io.ktor.server.testing.TestApplicationRequest
import io.ktor.server.testing.handleRequest
import io.ktor.server.testing.setBody
import io.ktor.server.testing.withTestApplication
import io.mockk.every
import io.mockk.mockk
import no.nav.etterlatte.DataSourceBuilder
import no.nav.etterlatte.UtkastPubliserer
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadRequest
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.libs.common.test.InnsendtSoeknadFixtures
import no.nav.etterlatte.soeknad.SoeknadService
import no.nav.etterlatte.toJson
import no.nav.security.token.support.core.context.TokenValidationContext
import no.nav.security.token.support.core.jwt.JwtToken
import no.nav.security.token.support.v2.TokenValidationContextPrincipal
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation
import org.junit.jupiter.api.Order
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.TestMethodOrder
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import soeknad.LagretSoeknad
import soeknad.PostgresSoeknadRepository
import soeknad.soeknadApi
import java.util.Arrays
import java.util.stream.Collectors

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(OrderAnnotation::class)
internal class SoeknadApiIntegrationTest {

    companion object {
        private const val STOR_SNERK = "11057523044"
        private const val LUR_KOPP = "04117120886"
        private const val BLÅØYD_SAKS = "05111850870"
        private const val VAKKER_PENN = "09038520129"
        private const val LUGUBER_MASKIN = "05117300236"
    }

    @Container
    private val postgreSQLContainer = PostgreSQLContainer<Nothing>("postgres:12")
    private lateinit var db: PostgresSoeknadRepository
    private lateinit var dsbHolder: DataSourceBuilder
    private lateinit var service: SoeknadService

    private val kilde = "barnepensjon-ui"
    private val dummyKladd = """{"harSamtykket":"true"}"""
    private val mapper = jacksonObjectMapper()
    private val mockUtkastPubliserer = mockk<UtkastPubliserer>()

    @BeforeAll
    fun beforeAll() {
        val (_, dsb) = opprettInMemoryDatabase(postgreSQLContainer)
        dsbHolder = dsb
        db = PostgresSoeknadRepository.using(dsb.dataSource)

        service = SoeknadService(db, mockUtkastPubliserer)
    }

    @AfterAll
    fun afterAll() {
        postgreSQLContainer.stop()
    }

    @Test
    @Order(1)
    fun `Skal opprette soeknad i databasen for gjenlevende`() {
        withTestApplication({ apiTestModule { soeknadApi(service) } }) {
            val request = SoeknadRequest(
                listOf(
                    InnsendtSoeknadFixtures.gjenlevendepensjon(Foedselsnummer.of(VAKKER_PENN))
                )
            )

            handleRequest(HttpMethod.Post, "/api/soeknad?kilde=$kilde") {
                addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                tokenFor(VAKKER_PENN)
                setBody(request.toJson())
            }
        }
    }

    @Test
    @Order(1)
    fun `Skal opprette soeknad i databasen for gjenlevende og barn`() {
        every { mockUtkastPubliserer.publiserSlettUtkastFraMinSide(any(), any()) } returns Unit

        withTestApplication({ apiTestModule { soeknadApi(service) } }) {
            val request = SoeknadRequest(
                soeknader = listOf(
                    InnsendtSoeknadFixtures.gjenlevendepensjon(innsenderFnr = Foedselsnummer.of(LUR_KOPP)),
                    InnsendtSoeknadFixtures.barnepensjon(innsenderFnr = Foedselsnummer.of(LUR_KOPP))
                )
            )

            handleRequest(HttpMethod.Post, "/api/soeknad?kilde=$kilde") {
                addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                tokenFor(LUR_KOPP)
                setBody(request.toJson())
            }.apply {
                response.status() shouldBe HttpStatusCode.OK

                // Verifiser søknad for gjenlevendepensjon
                val gjenlevendeRow = dsbHolder.dataSource.connection.createStatement()
                    .executeQuery("SELECT * FROM innhold WHERE fnr = '$LUR_KOPP'")
                gjenlevendeRow.next()

                gjenlevendeRow.getString("fnr") shouldBe LUR_KOPP
                gjenlevendeRow.getString("payload") shouldBe request.soeknader.first().toJson()

                // Verifiser egen søknad for barnepensjon
                val barnepensjonRow = dsbHolder.dataSource.connection.createStatement()
                    .executeQuery("SELECT * FROM innhold WHERE fnr = '$BLÅØYD_SAKS'")
                barnepensjonRow.next()

                barnepensjonRow.getString("fnr") shouldBe BLÅØYD_SAKS
                barnepensjonRow.getString("payload") shouldBe request.soeknader.last().toJson()
            }
        }
    }

    @Test
    @Order(1)
    fun `Skal returnere not found hvis en kladd ikke eksisterer`() {
        withTestApplication({ apiTestModule { soeknadApi(service) } }) {
            handleRequest(HttpMethod.Get, "/api/kladd?kilde=$kilde") {
                tokenFor(LUGUBER_MASKIN) // LUGUBER MASKIN
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

        withTestApplication({ apiTestModule { soeknadApi(service) } }) {
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

        withTestApplication({ apiTestModule { soeknadApi(service) } }) {
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

        withTestApplication({ apiTestModule { soeknadApi(service) } }) {
            handleRequest(HttpMethod.Delete, "/api/kladd?kilde=$kilde") {
                tokenFor(STOR_SNERK)
            }.apply {
                response.status() shouldBe HttpStatusCode.OK
                db.finnKladd(STOR_SNERK, kilde) shouldBe null
            }
        }
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
        """Bearer ${PlainJWT(JWTClaimsSet.Builder().claim("pid", fnr).issuer("lol").build()).serialize()}"""
    )
}

class TokenSupportAcceptAllProvider : AuthenticationProvider(ProviderConfiguration(null)) {

    class ProviderConfiguration internal constructor(name: String?) : Config(name)

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

    private fun extractBearerTokens(vararg headerValues: String): List<String> {
        return Arrays.stream(headerValues)
            .map { s: String ->
                s.split(
                    " ".toRegex()
                ).toTypedArray()
            }
            .filter { pair: Array<String> -> pair.size == 2 }
            .filter { pair: Array<String> ->
                pair[0].trim { it <= ' ' }
                    .equals("Bearer", ignoreCase = true)
            }
            .map { pair: Array<String> ->
                pair[1].trim { it <= ' ' }
            }
            .collect(Collectors.toList())
    }

    override suspend fun onAuthenticate(context: AuthenticationContext) {
        context.principal(
            TokenValidationContextPrincipal(
                TokenValidationContext(getTokensFromHeader(context.call.request.headers).associateBy { it.issuer })
            )
        )
    }
}

fun AuthenticationConfig.tokenTestSupportAcceptsAllTokens() = register(TokenSupportAcceptAllProvider())
