package inntektsjustering

import io.kotest.matchers.shouldBe
import no.nav.etterlatte.DataSourceBuilder
import no.nav.etterlatte.inntektsjustering.InntektsjusteringLagre
import no.nav.etterlatte.inntektsjustering.InntektsjusteringRepository
import no.nav.etterlatte.jobs.PubliserInntektsjusteringStatus
import no.nav.etterlatte.libs.common.inntektsjustering.Inntektsjustering
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
    fun `oppdater status for duplikater med IKKE_PUBLISER`() {
        repeat(2) {
            db.lagreInntektsjustering(
                VAKKER_PENN,
                InntektsjusteringLagre(
                    arbeidsinntekt = 100,
                    naeringsinntekt = 200,
                    arbeidsinntektUtland = 300,
                    naeringsinntektUtland = 400,
                ),
            )
        }

        db.hentInntektsjusteringForStatus(PubliserInntektsjusteringStatus.LAGRET).size shouldBe 2

        db.oppdaterDuplikaterStatus(
            PubliserInntektsjusteringStatus.LAGRET,
            PubliserInntektsjusteringStatus.IKKE_PUBLISERT,
        )

        db.hentInntektsjusteringForStatus(PubliserInntektsjusteringStatus.LAGRET).size shouldBe 1
        db.hentInntektsjusteringForStatus(PubliserInntektsjusteringStatus.IKKE_PUBLISERT).size shouldBe 1
    }

    @Test
    fun `oppdatere status paa innsendt soeknad`() {
        db.lagreInntektsjustering(
            VAKKER_PENN,
            InntektsjusteringLagre(
                arbeidsinntekt = 100,
                naeringsinntekt = 200,
                arbeidsinntektUtland = 300,
                naeringsinntektUtland = 400,
            ),
        )

        val resultat = db.hentSisteInntektsjusteringForStatus(PubliserInntektsjusteringStatus.LAGRET)
        resultat.size shouldBe 1
        val inntektsjustering = resultat[0]["@inntektsjustering"] as Inntektsjustering
        db.oppdaterInntektsjusteringStatus(inntektsjustering.id, PubliserInntektsjusteringStatus.PUBLISERT)
        db.hentSisteInntektsjusteringForStatus(PubliserInntektsjusteringStatus.LAGRET).size shouldBe 0
    }

    @Test
    fun `hent siste innsendte inntektsjusteringer`() {
        val foersteInntektsjustering =
            InntektsjusteringLagre(
                arbeidsinntekt = 100,
                naeringsinntekt = 200,
                arbeidsinntektUtland = 300,
                naeringsinntektUtland = 400,
            )
        db.lagreInntektsjustering(VAKKER_PENN, foersteInntektsjustering)

        val andreInntektsjustering =
            InntektsjusteringLagre(
                arbeidsinntekt = 200,
                naeringsinntekt = 300,
                arbeidsinntektUtland = 400,
                naeringsinntektUtland = 500,
            )
        db.lagreInntektsjustering(VAKKER_PENN, andreInntektsjustering)
        db.lagreInntektsjustering(SPYDIG_EGG, foersteInntektsjustering)

        val resultat = db.hentSisteInntektsjusteringForStatus(PubliserInntektsjusteringStatus.LAGRET)
        resultat.size shouldBe 2

        resultat[0]["@fnr"] shouldBe VAKKER_PENN.value
        val inntektsjustering = resultat[0]["@inntektsjustering"] as Inntektsjustering
        inntektsjustering.naeringsinntekt shouldBe andreInntektsjustering.naeringsinntekt

        resultat[1]["@fnr"] shouldBe SPYDIG_EGG.value
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