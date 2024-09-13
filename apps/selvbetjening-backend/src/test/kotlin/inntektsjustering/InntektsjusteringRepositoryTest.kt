package inntektsjustering

import io.kotest.matchers.shouldBe
import no.nav.etterlatte.DataSourceBuilder
import no.nav.etterlatte.inntektsjustering.InntektsjusteringLagre
import no.nav.etterlatte.inntektsjustering.InntektsjusteringRepository
import no.nav.etterlatte.jobs.PubliserInntektsjusteringStatus
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import opprettInMemoryDatabase
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import java.time.LocalDateTime
import java.time.ZoneId

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

    @BeforeEach
    fun resetDatabase() {
        dsbHolder.dataSource.connection.use { connection ->
            connection.prepareStatement("TRUNCATE TABLE inntektsjustering RESTART IDENTITY CASCADE").execute()
        }
    }

    @Test
    fun `oppdater inntektsjustering`() {
        val foersteInntektsjustering =
            InntektsjusteringLagre(
                arbeidsinntekt = 100,
                naeringsinntekt = 200,
                arbeidsinntektUtland = 300,
                naeringsinntektUtland = 400,
            )

        db.lagreInntektsjustering(VAKKER_PENN, foersteInntektsjustering)

        val foersteResult = db.hentInntektsjusteringForFnr(VAKKER_PENN)
        foersteResult?.arbeidsinntekt shouldBe 100

        db.oppdaterInntektsjustering(
            foersteInntektsjustering.id,
            InntektsjusteringLagre(
                arbeidsinntekt = 1000,
                naeringsinntekt = 2000,
                arbeidsinntektUtland = 3000,
                naeringsinntektUtland = 4000,
            ),
        )

        val andreResult = db.hentInntektsjusteringForFnr(VAKKER_PENN)
        andreResult?.arbeidsinntekt shouldBe 1000
        andreResult?.naeringsinntekt shouldBe 2000
        andreResult?.arbeidsinntektUtland shouldBe 3000
        andreResult?.naeringsinntektUtland shouldBe 4000
    }

    @Test
    fun `oppdatere status paa inntektsjustering`() {
        db.lagreInntektsjustering(
            VAKKER_PENN,
            InntektsjusteringLagre(
                arbeidsinntekt = 100,
                naeringsinntekt = 200,
                arbeidsinntektUtland = 300,
                naeringsinntektUtland = 400,
            ),
        )

        val resultat = db.hentInntektsjusteringForStatus(PubliserInntektsjusteringStatus.LAGRET)
        resultat.size shouldBe 1

        val (fnr, inntektsjustering) = resultat[0]
        db.oppdaterStatusForId(inntektsjustering.id, PubliserInntektsjusteringStatus.PUBLISERT)
        db.hentInntektsjusteringForStatus(PubliserInntektsjusteringStatus.LAGRET).size shouldBe 0
    }

    @Test
    fun `hent inntektsjusteringer for status`() {
        db.lagreInntektsjustering(
            VAKKER_PENN,
            InntektsjusteringLagre(
                arbeidsinntekt = 100,
                naeringsinntekt = 200,
                arbeidsinntektUtland = 300,
                naeringsinntektUtland = 400,
            ),
        )

        db.lagreInntektsjustering(
            SPYDIG_EGG,
            InntektsjusteringLagre(
                arbeidsinntekt = 150,
                naeringsinntekt = 250,
                arbeidsinntektUtland = 350,
                naeringsinntektUtland = 450,
            ),
        )

        val resultat = db.hentInntektsjusteringForStatus(PubliserInntektsjusteringStatus.LAGRET)
        resultat.size shouldBe 2
        resultat[0].first shouldBe SPYDIG_EGG.value
        resultat[1].first shouldBe VAKKER_PENN.value
    }

    @Test
    fun `skal lagre inntektsjustering`() {
        val ny =
            InntektsjusteringLagre(
                arbeidsinntekt = 100,
                naeringsinntekt = 200,
                arbeidsinntektUtland = 300,
                naeringsinntektUtland = 400,
            )

        db.lagreInntektsjustering(VAKKER_PENN, ny)
        val lagret = db.hentInntektsjusteringForFnr(VAKKER_PENN) ?: throw Exception()

        with(lagret) {
            id shouldBe ny.id
            arbeidsinntekt shouldBe ny.arbeidsinntekt
            naeringsinntekt shouldBe ny.naeringsinntekt
            arbeidsinntektUtland shouldBe ny.arbeidsinntektUtland
            naeringsinntektUtland shouldBe ny.naeringsinntektUtland
            LocalDateTime.now().let { naa ->
                tidspunkt.atZone(ZoneId.of("UTC")).let {
                    it.year shouldBe naa.year
                    it.month shouldBe naa.month
                    it.dayOfMonth shouldBe naa.dayOfMonth
                }
            }
        }
    }

    companion object {
        private val VAKKER_PENN = Foedselsnummer.of(("09038520129"))
        private val SPYDIG_EGG = Foedselsnummer.of(("30116448684"))
    }
}