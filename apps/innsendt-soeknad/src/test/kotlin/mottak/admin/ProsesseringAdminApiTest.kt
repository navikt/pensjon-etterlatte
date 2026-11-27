package no.nav.etterlatte.mottak.admin

import com.nimbusds.jwt.JWTClaimsSet
import com.nimbusds.jwt.PlainJWT
import efterlatte.prosessering.postgres.PostgresTaskRepository
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain
import io.ktor.client.request.HttpRequestBuilder
import io.ktor.client.request.get
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.HttpResponse
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpStatusCode
import io.ktor.http.contentType
import io.ktor.serialization.jackson3.jackson
import io.ktor.server.application.install
import io.ktor.server.auth.Authentication
import io.ktor.server.auth.AuthenticationContext
import io.ktor.server.auth.AuthenticationProvider
import io.ktor.server.plugins.contentnegotiation.ContentNegotiation
import io.ktor.server.routing.routing
import io.ktor.server.testing.ApplicationTestBuilder
import io.ktor.server.testing.testApplication
import no.nav.etterlatte.mapper
import no.nav.security.token.support.core.context.TokenValidationContext
import no.nav.security.token.support.core.jwt.JwtToken
import no.nav.security.token.support.v3.TokenValidationContextPrincipal
import opprettInMemoryDatabase
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import tools.jackson.databind.cfg.DateTimeFeature
import java.time.Instant
import javax.sql.DataSource

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
internal class ProsesseringAdminApiTest {
    @Container
    private val postgreSQLContainer = PostgreSQLContainer<Nothing>("postgres:14")

    private lateinit var dataSource: DataSource
    private lateinit var dao: ProsesseringAdminDao
    private lateinit var repo: PostgresTaskRepository

    private val gruppe = "operatoergruppe"
    private val operatoer = token(navIdent = "Z999999", grupper = listOf(gruppe))

    @BeforeAll
    fun beforeAll() {
        val (_, dsb) = opprettInMemoryDatabase(postgreSQLContainer)
        dataSource = dsb.dataSource
        dao = ProsesseringAdminDao(dataSource)
        repo = PostgresTaskRepository(dataSource)
    }

    @AfterEach
    fun reset() {
        dataSource.connection.use {
            it.prepareStatement("TRUNCATE prosessering_task, prosessering_task_hendelse RESTART IDENTITY").execute()
        }
    }

    @AfterAll
    fun afterAll() = postgreSQLContainer.stop()

    @Test
    fun `avviser token uten operatoergruppe, maskintoken og manglende token`() =
        adminTest {
            client
                .get(
                    "/api/prosessering/task/status-oversikt",
                ) { bearer(token("Z999999", listOf("annen"))) }
                .status shouldBe
                HttpStatusCode.Forbidden
            client.get("/api/prosessering/task/status-oversikt") { bearer(maskintoken()) }.status shouldBe
                HttpStatusCode.Forbidden
            val uten = client.get("/api/prosessering/task/status-oversikt")
            uten.status shouldBe HttpStatusCode.Forbidden
            uten.contentType().toString() shouldContain "application/problem+json"
        }

    @Test
    fun `gir eksakte tellinger for alle statuser og typer`() =
        adminTest {
            opprett("A", 1)
            opprett("A", 2)
            val stoppet = opprett("B", 3)
            settStatus(stoppet, "STOPPET")

            val oversikt = json(client.get("/api/prosessering/task/status-oversikt") { bearer(operatoer) })
            oversikt.values().associate { it["status"].asString() to it["antall"].asLong() } shouldBe
                mapOf("KLAR" to 2L, "KJØRER" to 0L, "FULLFØRT" to 0L, "STOPPET" to 1L, "AVBRUTT" to 0L)
            json(client.get("/api/prosessering/task/typer") { bearer(operatoer) }).values().map {
                it["type"].asString() to it["antall"].asLong()
            } shouldBe listOf("A" to 2L, "B" to 1L)
        }

    @Test
    fun `lister med filter og paginering, og viser feil, endringstid og metadata`() =
        adminTest {
            repeat(3) { opprett("A", it.toLong()) }
            val feilet = opprett("B", 9)
            dataSource.connection.use {
                it
                    .prepareStatement(
                        "UPDATE prosessering_task SET siste_feilmelding = 'DokarkivFeil: 500' WHERE id = $feilet",
                    ).executeUpdate()
            }

            val side = json(client.get("/api/prosessering/task?type=A&side=2&antallPerSide=2") { bearer(operatoer) })
            side["antallTotalt"].asLong() shouldBe 3
            side["antallSider"].asInt() shouldBe 2
            side["tasks"].size() shouldBe 1

            val detalj = json(client.get("/api/prosessering/task/$feilet") { bearer(operatoer) })
            detalj["sisteFeilmelding"].asString() shouldBe "DokarkivFeil: 500"
            detalj["metadata"]["soeknadId"].asString() shouldBe "9"
            Instant.parse(detalj["sistEndretTid"].asString())
            client.get("/api/prosessering/task?status=UKJENT") { bearer(operatoer) }.status shouldBe
                HttpStatusCode.BadRequest
            client.get("/api/prosessering/task?antallPerSide=101") { bearer(operatoer) }.status shouldBe
                HttpStatusCode.BadRequest
            client.get("/api/prosessering/task/999") { bearer(operatoer) }.status shouldBe HttpStatusCode.NotFound
        }

    @Test
    fun `rekjoerer stoppet task med riktig versjon og logger operatoeren`() =
        adminTest {
            val id = opprett("A", 1)
            settStatus(id, "STOPPET")
            val versjon = dao.finn(id)!!.versjon

            client
                .post("/api/prosessering/task/$id/rekjor") {
                    bearer(operatoer)
                    body("""{"versjon":${versjon + 1}}""")
                }.let {
                    it.status shouldBe HttpStatusCode.Conflict
                    json(it)["detail"].asString() shouldContain "endret av noen andre"
                }
            val svar =
                json(
                    client.post("/api/prosessering/task/$id/rekjor") {
                        bearer(operatoer)
                        body("""{"versjon":$versjon}""")
                    },
                )
            svar["status"].asString() shouldBe "KLAR"
            svar["versjon"].asLong() shouldBe versjon + 1

            client
                .post("/api/prosessering/task/$id/rekjor") {
                    bearer(operatoer)
                    body("""{"versjon":${versjon + 1}}""")
                }.let {
                    it.status shouldBe HttpStatusCode.Conflict
                    json(it)["detail"].asString() shouldContain "har status KLAR og kan ikke rekjøres"
                }
            val logg = json(client.get("/api/prosessering/task/$id/logg") { bearer(operatoer) }).values().last()
            logg["endretAv"].asString() shouldBe "Z999999"
            logg["type"].asString() shouldBe "STATUS_ENDRET"
        }

    @Test
    fun `avvik avbryter tasken og lagrer meldingen, kommentar endrer ikke status`() =
        adminTest {
            val id = opprett("A", 1)
            client
                .post("/api/prosessering/task/$id/avvik") {
                    bearer(operatoer)
                    body("""{"versjon":0,"melding":" "}""")
                }.status shouldBe
                HttpStatusCode.BadRequest

            val avbrutt =
                client.post("/api/prosessering/task/$id/avvik") {
                    bearer(operatoer)
                    body("""{"versjon":0,"melding":"Manuelt"}""")
                }
            json(avbrutt)["status"].asString() shouldBe "AVBRUTT"
            client
                .post("/api/prosessering/task/$id/kommentar") {
                    bearer(operatoer)
                    body("""{"melding":"Sjekket"}""")
                }.status shouldBe
                HttpStatusCode.Created

            dao.finn(id)!!.status.name shouldBe "AVBRUTT"
            json(
                client.get("/api/prosessering/task/$id/logg") {
                    bearer(operatoer)
                },
            ).values().map { it["type"].asString() } shouldBe
                listOf("STATUS_ENDRET", "AVVIK", "KOMMENTAR")
        }

    private fun opprett(
        type: String,
        soeknadId: Long,
    ) = repo.insertIEgenTransaksjon(
        type,
        """{"soeknadId":$soeknadId}""",
        Instant.now().plusSeconds(3600),
        """{"soeknadId":"$soeknadId"}""",
    )

    private fun settStatus(
        id: Long,
        status: String,
    ) = dataSource.connection.use {
        it.prepareStatement("UPDATE prosessering_task SET status = '$status' WHERE id = $id").executeUpdate()
    }

    private fun adminTest(block: suspend ApplicationTestBuilder.() -> Unit) =
        testApplication {
            application {
                install(ContentNegotiation) { jackson { disable(DateTimeFeature.WRITE_DATES_AS_TIMESTAMPS) } }
                install(Authentication) { register(TestAzureProvider()) }
                routing { prosesseringAdminApi(dao, gruppe, "test") }
            }
            block()
        }

    private suspend fun json(response: HttpResponse) = mapper.readTree(response.bodyAsText())

    private fun HttpRequestBuilder.bearer(token: String?) {
        token?.let { header(HttpHeaders.Authorization, "Bearer $it") }
    }

    private fun HttpRequestBuilder.body(json: String) {
        contentType(ContentType.Application.Json)
        setBody(json)
    }

    private fun token(
        navIdent: String,
        grupper: List<String>,
    ) = PlainJWT(
        JWTClaimsSet
            .Builder()
            .issuer(AZURE_ISSUER)
            .claim("NAVident", navIdent)
            .claim("groups", grupper)
            .build(),
    ).serialize()

    private fun maskintoken() =
        PlainJWT(
            JWTClaimsSet
                .Builder()
                .issuer(AZURE_ISSUER)
                .claim("idtyp", "app")
                .claim("roles", listOf("access_as_application"))
                .build(),
        ).serialize()

    /** Godtar alle tokens og legger dem på issueren de oppgir, slik token-support gjør etter validering. */
    private class TestAzureProvider : AuthenticationProvider(object : Config(ADMIN_AUTH) {}) {
        override suspend fun onAuthenticate(context: AuthenticationContext) {
            val tokens =
                context.call.request.headers[HttpHeaders.Authorization]
                    ?.removePrefix("Bearer ")
                    ?.let { listOf(JwtToken(it)) }
                    .orEmpty()
            context.principal(TokenValidationContextPrincipal(TokenValidationContext(tokens.associateBy { it.issuer })))
        }
    }
}