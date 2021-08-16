
import no.nav.etterlatte.DataSourceBuilder
import no.nav.etterlatte.PostgresSoeknadRepository
import no.nav.etterlatte.UlagretSoeknad
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container

class DbIntegrationTest {
    @Container
    private val postgreSQLContainer = PostgreSQLContainer<Nothing>("postgres:12")


    @Test @Disabled
    fun test(){
        postgreSQLContainer.start()
        postgreSQLContainer.withUrlParam("user", postgreSQLContainer.username)
        postgreSQLContainer.withUrlParam("password", postgreSQLContainer.password)
        val dsb = DataSourceBuilder(mapOf("DB_JDBC_URL" to postgreSQLContainer.jdbcUrl))
        dsb.migrate()
        val db = PostgresSoeknadRepository.using(dsb.getDataSource())

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



        postgreSQLContainer.stop()


    }
}