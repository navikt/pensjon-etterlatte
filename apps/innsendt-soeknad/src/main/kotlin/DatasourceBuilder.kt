package no.nav.etterlatte

import com.zaxxer.hikari.HikariConfig
import com.zaxxer.hikari.HikariDataSource
import org.flywaydb.core.Flyway
import javax.sql.DataSource

class DataSourceBuilder(env: Map<String, String>) {
    private val hikariConfig = HikariConfig().apply {
        jdbcUrl = env["DB_URL"]
        maximumPoolSize = 3
        minimumIdle = 1
        idleTimeout = 10001
        connectionTimeout = 1000
        maxLifetime = 30001
    }

    fun getDataSource() = HikariDataSource(hikariConfig)

    fun migrate() =runMigration(getDataSource())


    private fun runMigration(dataSource: DataSource) =
        Flyway.configure()
            .dataSource(dataSource)
            .load()
            .migrate()
}

data class JournalPostInfo(
    val tittel: String,
    val avsenderMottaker: AvsenderMottaker,
    val bruker: Bruker
)

data class AvsenderMottaker(
    val id: String,
    val navn:String,
    val idType: String
)

data class Bruker(
    val id: String,
    val idType: String
)