
import kotliquery.queryOf
import kotliquery.sessionOf
import kotliquery.using
import no.nav.etterlatte.DataSourceBuilder
import no.nav.etterlatte.PostgresSoeknadRepository
import no.nav.etterlatte.UlagretSoeknad
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container

class DbIntegrationTest {
    val url = "jdbc:h2:mem:myDb;DB_CLOSE_DELAY=-1;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE"
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
        val soekand1 = db.nySoeknad(UlagretSoeknad("abc", """{}"""))
        val soekand2 = db.nySoeknad(UlagretSoeknad("abc", """{}"""))
        val soekand3 = db.nySoeknad(UlagretSoeknad("abc", """{}"""))


        db.rapport().also (::println)

        db.soeknadSendt(soekand1)
        db.soeknadSendt(soekand2)
        db.soeknadArkivert(soekand1)

        db.rapport().also (::println)

        using(sessionOf(dsb.getDataSource())) { session ->
            session.transaction {
                it.run(queryOf(
                    """with status_rang as (
                        |select 'opprettet' "status", 1 "rang"
                        |union select 'sendt' "status", 2 "rang"
                        |union select 'arkivert' "status", 3 "rang"
                        |union select 'arkiveringsfeil' "status", 4 "rang"
                        |) select status, count(1) from 
                        |(select soeknad, max(rang) "rang" from hendelse h inner join status_rang using(status) group by soeknad) valgtstatus
                        |inner join status_rang using(rang)
                        |group by status
                        |union select 'opprettet', count(1) from soeknad s where s.id not in (select soeknad from hendelse )""".trimMargin(), emptyMap()).map { row ->
                    Pair(row.string(1), row.long(2))
                }.asList)
            }
        }.toMap().also { println(it) }
        println(db.rapport())
        db.slettArkiverteSoeknader()
        println(db.rapport())



        postgreSQLContainer.stop()


    }
}