package inntektsjustering

import io.kotest.matchers.shouldBe
import no.nav.etterlatte.DataSourceBuilder
import no.nav.etterlatte.inntektsjustering.Inntektsjustering
import no.nav.etterlatte.inntektsjustering.InntektsjusteringRepository
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import opprettInMemoryDatabase
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class InntektsjusteringRepositoryTest {

	@Container
	private val postgreSQLContainer = PostgreSQLContainer<Nothing>("postgres:14")
	private lateinit var db: InntektsjusteringRepository
	private lateinit var dsbHolder: DataSourceBuilder

	@BeforeAll
	fun beforeAll() {
		val (_, dsb) = opprettInMemoryDatabase(postgreSQLContainer)
		dsbHolder = dsb
		dsb.migrate()
		db = InntektsjusteringRepository(dsb.dataSource)
	}

	@AfterAll
	fun afterAll() {
		postgreSQLContainer.stop()
	}

	@Test
	fun `skal lagre inntektsjustering`() {
		val ny = Inntektsjustering(
			arbeidsinntekt = 100,
			naeringsinntekt = 200,
			arbeidsinntektUtland = 300,
			naeringsinntektUtland = 400,
		)

		db.lagreInntektsjustering(VAKKER_PENN, ny)
		val lagret = db.hentInntektsjustering(VAKKER_PENN)
		
		lagret shouldBe ny
	}

	companion object {
		private val VAKKER_PENN = Foedselsnummer.of(("09038520129"))
	}

}