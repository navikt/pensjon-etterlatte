
import no.nav.etterlatte.DataSourceBuilder
import no.nav.etterlatte.PostgresSoeknadRepository
import no.nav.etterlatte.UlagretSoeknad
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import java.util.*

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class DbIntegrationTest {
    @Container
    private val postgreSQLContainer = PostgreSQLContainer<Nothing>("postgres:12")

    private lateinit var db: PostgresSoeknadRepository

    @BeforeAll
    fun beforeAll() {
        postgreSQLContainer.start()
        postgreSQLContainer.withUrlParam("user", postgreSQLContainer.username)
        postgreSQLContainer.withUrlParam("password", postgreSQLContainer.password)

        val dsb = DataSourceBuilder(mapOf("DB_JDBC_URL" to postgreSQLContainer.jdbcUrl))
        dsb.migrate()

        db = PostgresSoeknadRepository.using(dsb.getDataSource())
    }

    @AfterAll
    fun afterAll() {
        postgreSQLContainer.stop()
    }

    @Test @Disabled
    fun test(){
        val soekand1 = db.lagreKladd(UlagretSoeknad("abc", """{}"""))

        db.lagreKladd(UlagretSoeknad("abc", """{}"""))

        println(db.lagreKladd(UlagretSoeknad("abc", """{}""")).id)
        println(db.lagreKladd(UlagretSoeknad("abc", """{}""")).id)

        db.soeknadFerdigstilt(soekand1)

        println(db.lagreKladd(UlagretSoeknad("abc", """{}""")).id)

        db.rapport().also (::println)

        println(db.rapport())
        db.slettArkiverteSoeknader()
        println(db.rapport())
    }

    @Test
    fun `Lagring og uthenting av kladd fungerer som forventet`() {
        val fnr = "11111111111"
        val json = """{"harSamtykket":true}"""

        val soeknad = UlagretSoeknad(fnr, json)

        val lagretKladd = db.lagreKladd(soeknad)

        val funnetKladd = db.finnKladd(fnr)!!

        assertNotNull(funnetKladd.id)
        assertEquals(fnr, funnetKladd.fnr)
        assertEquals(json, funnetKladd.soeknad)

        assertEquals(lagretKladd, funnetKladd)
    }

    @Test
    fun `Hent kladd som ikke finnes`() {
        val kladd = db.finnKladd("finnes ikke")

        assertNull(kladd)
    }

    @Test
    fun `Lagre ferdig søknad hvor kladd IKKE finnes`() {
        val fnr = "22222222222"
        val json = """{"harSamtykket":true}"""

        assertNull(db.finnKladd(fnr))

        val soeknad = UlagretSoeknad(fnr, json)

        val lagretSoeknad = db.lagreSoeknad(soeknad)

        assertEquals(json, lagretSoeknad.soeknad)
    }

    @Test
    fun `Lagre ferdig søknad hvor kladd finnes`() {
        val fnr = "33333333333"
        val json = """{"harSamtykket":true}"""
        val soeknad = UlagretSoeknad(fnr, json)

        assertNull(db.finnKladd(fnr))

        val lagretKladd = db.lagreKladd(soeknad)
        assertNotNull(lagretKladd)

        val funnetKladd = db.finnKladd(fnr)!!
        assertEquals(lagretKladd.id, funnetKladd.id)
        assertEquals(lagretKladd.fnr, funnetKladd.fnr)
        assertEquals(lagretKladd.soeknad, funnetKladd.soeknad)

        val nyJson = """{"harSamtykket":true,"omDeg":{"bostedsadresseBekreftet":"Ja"}}"""
        val endretSoeknad = UlagretSoeknad(fnr, nyJson)

        val lagretSoeknad = db.lagreSoeknad(endretSoeknad)
        assertEquals(lagretKladd.id, lagretSoeknad.id)
        assertEquals(lagretKladd.fnr, lagretSoeknad.fnr)
        assertEquals(endretSoeknad.soeknad, lagretSoeknad.soeknad)
    }
}
