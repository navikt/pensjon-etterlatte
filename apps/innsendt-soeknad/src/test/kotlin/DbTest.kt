
import kotliquery.queryOf
import kotliquery.sessionOf
import kotliquery.using
import no.nav.etterlatte.DataSourceBuilder
import no.nav.etterlatte.SoeknadDao
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container

class DbTest {
    val url = "jdbc:h2:mem:myDb;DB_CLOSE_DELAY=-1;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE"
    @Container
    private val postgreSQLContainer = PostgreSQLContainer<Nothing>("postgres:12")


    @Test
    fun test(){
        postgreSQLContainer.start()
        postgreSQLContainer.withUrlParam("user", postgreSQLContainer.username)
        postgreSQLContainer.withUrlParam("password", postgreSQLContainer.password)
        val dsb = DataSourceBuilder(mapOf("DB_URL" to postgreSQLContainer.jdbcUrl))
        dsb.migrate()
        val db = SoeknadDao(dsb.getDataSource())

        var usendte = db.usendteSoeknader()
        Assertions.assertEquals(0, usendte.size)


        using(sessionOf(dsb.getDataSource())) { session ->
            session.transaction {
                it.run(queryOf("UPDATE soeknad set opprettet = opprettet - interval '30 minutes'").asExecute)
            }
        }

        usendte = db.usendteSoeknader()
        Assertions.assertEquals(1, usendte.size)

        usendte.forEach(db::soeknadSendt)
        Assertions.assertEquals(0, db.usendteSoeknader().size)

        postgreSQLContainer.stop()


    }
}