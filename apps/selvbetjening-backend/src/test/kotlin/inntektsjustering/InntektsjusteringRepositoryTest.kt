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
                inntektFraUtland = 300,
                AFPInntekt = 0,
                AFPTjenesteordning = null,
                skalGaaAvMedAlderspensjon = "NEI",
                datoForAaGaaAvMedAlderspensjon = null,
            )

        db.lagreInntektsjustering(VAKKER_PENN, foersteInntektsjustering)

        val foersteResult = db.hentInntektsjusteringForFnr(VAKKER_PENN)
        foersteResult?.arbeidsinntekt shouldBe 100

        db.oppdaterInntektsjustering(
            foersteInntektsjustering.id,
            InntektsjusteringLagre(
                arbeidsinntekt = 1000,
                naeringsinntekt = 2000,
                inntektFraUtland = 3000,
                AFPInntekt = 0,
                AFPTjenesteordning = null,
                skalGaaAvMedAlderspensjon = "NEI",
                datoForAaGaaAvMedAlderspensjon = null,
            ),
        )

        val andreResult = db.hentInntektsjusteringForFnr(VAKKER_PENN)
        andreResult?.arbeidsinntekt shouldBe 1000
        andreResult?.naeringsinntekt shouldBe 2000
        andreResult?.inntektFraUtland shouldBe 3000
        // TODO flere felter..
    }

    @Test
    fun `oppdatere status paa inntektsjustering`() {
        db.lagreInntektsjustering(
            VAKKER_PENN,
            InntektsjusteringLagre(
                arbeidsinntekt = 100,
                naeringsinntekt = 200,
                inntektFraUtland = 300,
                AFPInntekt = 0,
                AFPTjenesteordning = null,
                skalGaaAvMedAlderspensjon = "NEI",
                datoForAaGaaAvMedAlderspensjon = null,
            ),
        )

        val resultat = db.hentAlleInntektsjusteringerForStatus(PubliserInntektsjusteringStatus.LAGRET)
        resultat.size shouldBe 1

        val (fnr, inntektsjustering) = resultat[0]
        db.oppdaterStatusForId(inntektsjustering.id, PubliserInntektsjusteringStatus.PUBLISERT)
        db.hentAlleInntektsjusteringerForStatus(PubliserInntektsjusteringStatus.LAGRET).size shouldBe 0
    }

    @Test
    fun `hent inntektsjusteringer for status`() {
        db.lagreInntektsjustering(
            VAKKER_PENN,
            InntektsjusteringLagre(
                arbeidsinntekt = 100,
                naeringsinntekt = 200,
                inntektFraUtland = 300,
                AFPInntekt = 0,
                AFPTjenesteordning = null,
                skalGaaAvMedAlderspensjon = "NEI",
                datoForAaGaaAvMedAlderspensjon = null,
            ),
        )

        db.lagreInntektsjustering(
            SPYDIG_EGG,
            InntektsjusteringLagre(
                arbeidsinntekt = 150,
                naeringsinntekt = 250,
                inntektFraUtland = 350,
                AFPInntekt = 0,
                AFPTjenesteordning = null,
                skalGaaAvMedAlderspensjon = "NEI",
                datoForAaGaaAvMedAlderspensjon = null,
            ),
        )

        val resultat = db.hentAlleInntektsjusteringerForStatus(PubliserInntektsjusteringStatus.LAGRET)
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
                inntektFraUtland = 300,
                AFPInntekt = 0,
                AFPTjenesteordning = null,
                skalGaaAvMedAlderspensjon = "NEI",
                datoForAaGaaAvMedAlderspensjon = null,
            )

        db.lagreInntektsjustering(VAKKER_PENN, ny)
        val lagret = db.hentInntektsjusteringForFnr(VAKKER_PENN) ?: throw Exception()

        with(lagret) {
            id shouldBe ny.id
            arbeidsinntekt shouldBe ny.arbeidsinntekt
            naeringsinntekt shouldBe ny.naeringsinntekt
            inntektFraUtland shouldBe ny.inntektFraUtland
            // TODO flere felter
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