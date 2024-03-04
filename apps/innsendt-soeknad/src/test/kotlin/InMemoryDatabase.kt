import no.nav.etterlatte.DataSourceBuilder
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.containers.wait.strategy.LogMessageWaitStrategy
import org.testcontainers.containers.wait.strategy.Wait
import org.testcontainers.containers.wait.strategy.WaitAllStrategy
import java.time.Duration
import java.time.temporal.ChronoUnit

val CONTAINER_WAIT_STRATEGY = WaitAllStrategy().withStrategy(
    LogMessageWaitStrategy().withRegEx(".*database system is ready to accept connections.*\\s").withTimes(2)
        .withStartupTimeout(
            Duration.of(60L, ChronoUnit.SECONDS)
        )
).withStrategy(Wait.forListeningPort())

fun opprettInMemoryDatabase(postgreSQLContainer: PostgreSQLContainer<Nothing>, env: Map<String, String>? = null, shouldMigrate: Boolean = true): InMemoryDatabase {
    postgreSQLContainer.waitingFor(CONTAINER_WAIT_STRATEGY)
    postgreSQLContainer.start()
    postgreSQLContainer.withUrlParam("user", postgreSQLContainer.username)
    postgreSQLContainer.withUrlParam("password", postgreSQLContainer.password)
    val jdbc = mutableMapOf("DB_JDBC_URL" to postgreSQLContainer.jdbcUrl)
    env?.let { jdbc.putAll(it) }
    val datasource =
        DataSourceBuilder(jdbc)
    if(shouldMigrate) {
        datasource.migrate()
    }
    return InMemoryDatabase(postgreSQLContainer, datasource)
}


data class InMemoryDatabase(
    val sqlContainer: PostgreSQLContainer<Nothing>,
    val dsb: DataSourceBuilder,
)