import no.nav.etterlatte.DataSourceBuilder
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import javax.sql.DataSource

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class DatasourceBuilderTest {
	@Container
	private val postgreSQLContainer = PostgreSQLContainer<Nothing>("postgres:14")

	@BeforeAll
	fun beforeAll() {
		val (_, dsb) =
			opprettInMemoryDatabase(
				postgreSQLContainer,
				mapOf("NAIS_CLUSTER_NAME" to "integrationtest"),
				shouldMigrate = false
			)

		dsb.dataSource.createGcpPersonalRole()
		dsb.migrate()
		dsb.dataSource.createPersonalUser()
		dsb.dataSource.grantRole()
	}

	private fun DataSource.createPersonalUser() {
		connection.use {
			it.prepareStatement("CREATE USER personaluser WITH PASSWORD 'password';").use {
				it.execute()
			}
		}
	}

	private fun DataSource.createGcpPersonalRole() {
		connection.use {
			it.prepareStatement("CREATE ROLE cloudsqliamuser;").use {
				it.execute()
			}
		}
	}

	private fun DataSource.grantRole() {
		connection.use {
			it.prepareStatement("grant cloudsqliamuser to personaluser;").use {
				it.execute()
			}
		}
	}

	@AfterAll
	fun afterAll() {
		postgreSQLContainer.stop()
	}
	/*
	TODO
		@Test
		fun `GCP user should have been granted access`() {
			DataSourceBuilder(
				mapOf(
					"DB_HOST" to postgreSQLContainer.host,
					"DB_PORT" to postgreSQLContainer.firstMappedPort.toString(),
					"DB_DATABASE" to postgreSQLContainer.databaseName,
					"DB_USERNAME" to "personaluser",
					"DB_PASSWORD" to "password"
				)
			).dataSource.let(PostgresSoeknadRepository::using).eldsteUarkiverte()
		}
	 */
}