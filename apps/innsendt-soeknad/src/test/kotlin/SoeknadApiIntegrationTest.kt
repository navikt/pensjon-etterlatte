
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import io.ktor.application.Application
import io.ktor.application.install
import io.ktor.features.ContentNegotiation
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.HttpMethod
import io.ktor.http.HttpStatusCode
import io.ktor.jackson.jackson
import io.ktor.routing.IgnoreTrailingSlash
import io.ktor.routing.Route
import io.ktor.routing.routing
import io.ktor.server.testing.handleRequest
import io.ktor.server.testing.setBody
import io.ktor.server.testing.withTestApplication
import no.nav.etterlatte.DataSourceBuilder
import no.nav.etterlatte.PostgresSoeknadRepository
import no.nav.etterlatte.soeknadApi
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation
import org.junit.jupiter.api.Order
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.TestMethodOrder
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(OrderAnnotation::class)
class SoeknadApiIntegrationTest {

    @Container
    private val postgreSQLContainer = PostgreSQLContainer<Nothing>("postgres:12")
    private lateinit var db: PostgresSoeknadRepository
    private lateinit var dsb: DataSourceBuilder
    private val dummySoeknad = """{"harSamtykket":"true"}"""

    @BeforeAll
    fun beforeAll() {
        setupDatabase()
    }

    @AfterAll
    fun afterAll() {
        postgreSQLContainer.stop()
    }

    @Test
    @Order(1)
    fun `Skal opprette soeknad i databasen`() {
        withTestApplication({ apiTestModule { soeknadApi(db, "26117512737") } }) {
            handleRequest(HttpMethod.Post, "/api/soeknad") {
                addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                setBody(dummySoeknad)
            }.apply {
                response.status() shouldBe HttpStatusCode.OK
                response.content shouldBe "1"

                val lagretSoeknadRow = dsb.dataSource.connection.createStatement()
                    .executeQuery("SELECT * FROM SOEKNAD WHERE fnr = '26117512737'")
                lagretSoeknadRow.next()

                lagretSoeknadRow.getInt("id") shouldBe 1
                lagretSoeknadRow.getString("fnr") shouldBe "26117512737"
                lagretSoeknadRow.getString("data") shouldBe dummySoeknad
            }
        }
    }

    @Test
    @Order(1)
    fun `Skal returnere not found hvis en kladd ikke eksisterer`() {
        withTestApplication({ apiTestModule { soeknadApi(db, "INVALID_FNR") } }) {
            handleRequest(HttpMethod.Get, "/api/kladd").apply {
                response.status() shouldBe HttpStatusCode.NotFound
            }
        }
    }

    @Test
    @Order(2)
    fun `Skal lagre kladd ned i databasen`() {
        db.finnKladd("11057523044") shouldBe null

        withTestApplication({ apiTestModule { soeknadApi(db, "11057523044") } }) {
            handleRequest(HttpMethod.Post, "/api/kladd") {
                addHeader(HttpHeaders.ContentType, ContentType.Application.Json.toString())
                setBody(dummySoeknad)
            }.apply {
                response.status() shouldBe HttpStatusCode.OK
                response.content shouldBe "2"

                val kladd = db.finnKladd("11057523044")
                kladd shouldNotBe null
                kladd?.id shouldBe 2
                kladd?.fnr shouldBe "11057523044"
                kladd?.soeknad shouldBe dummySoeknad
            }
        }
    }

    @Test
    @Order(3)
    fun `Skal hente kladd fra databasen`() {
        db.finnKladd("11057523044") shouldNotBe null

        withTestApplication({ apiTestModule { soeknadApi(db, "11057523044") } }) {
            handleRequest(HttpMethod.Get, "/api/kladd").apply {
                response.status() shouldBe HttpStatusCode.OK
                response.content shouldBe """{"fnr":"11057523044","soeknad":"{\"harSamtykket\":\"true\"}","id":2}"""
            }
        }
    }

    @Test
    @Order(4)
    fun `Skal slette kladd fra databasen`() {
        db.finnKladd("11057523044") shouldNotBe null

        withTestApplication({ apiTestModule { soeknadApi(db, "11057523044") } }) {
            handleRequest(HttpMethod.Delete, "/api/kladd").apply {
                response.status() shouldBe HttpStatusCode.OK
                db.finnKladd("11057523044") shouldBe null
            }
        }
    }

    private fun setupDatabase() {
        postgreSQLContainer.start()
        postgreSQLContainer.withUrlParam("user", postgreSQLContainer.username)
        postgreSQLContainer.withUrlParam("password", postgreSQLContainer.password)

        dsb = DataSourceBuilder(mapOf("DB_JDBC_URL" to postgreSQLContainer.jdbcUrl))
        dsb.migrate()

        db = PostgresSoeknadRepository.using(dsb.dataSource)
    }
}

fun Application.apiTestModule(routes: Route.() -> Unit) {
    install(ContentNegotiation) {
        jackson()
    }
    install(IgnoreTrailingSlash)

    routing {
        routes()
    }
}
