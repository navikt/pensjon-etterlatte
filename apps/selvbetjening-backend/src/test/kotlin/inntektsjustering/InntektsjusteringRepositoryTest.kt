package inntektsjustering

import io.kotest.matchers.shouldBe
import no.nav.etterlatte.DataSourceBuilder
import no.nav.etterlatte.inntektsjustering.InntektsjusteringLagre
import no.nav.etterlatte.inntektsjustering.InntektsjusteringRepository
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import opprettInMemoryDatabase
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import java.time.LocalDateTime

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
		val ny = InntektsjusteringLagre(
			arbeidsinntekt = 100,
			naeringsinntekt = 200,
			arbeidsinntektUtland = 300,
			naeringsinntektUtland = 400,
		)

		db.lagreInntektsjustering(VAKKER_PENN, ny)
		val lagret = db.hentInntektsjustering(VAKKER_PENN) ?: throw Exception()
		
		with(lagret) {
			id shouldBe ny.id
			arbeidsinntekt shouldBe ny.arbeidsinntekt
			naeringsinntekt shouldBe ny.naeringsinntekt
			arbeidsinntektUtland shouldBe ny.arbeidsinntektUtland
			naeringsinntektUtland shouldBe ny.naeringsinntektUtland
			LocalDateTime.now().let { naa ->
				tidspunkt.year shouldBe naa.year
				tidspunkt.hour shouldBe naa.hour
				tidspunkt.minute shouldBe naa.minute
			}
		}
	}

	companion object {
		private val VAKKER_PENN = Foedselsnummer.of(("09038520129"))
	}

}