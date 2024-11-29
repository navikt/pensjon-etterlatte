package inntektsjustering

import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import no.nav.etterlatte.DataSourceBuilder
import no.nav.etterlatte.inntektsjustering.InntektsjusteringLagre
import no.nav.etterlatte.inntektsjustering.InntektsjusteringRepository
import no.nav.etterlatte.inntektsjustering.InntektsjusteringStatus
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import opprettInMemoryDatabase
import org.junit.jupiter.api.AfterAll
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container
import java.time.LocalDate
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
                afpInntekt = 0,
                afpTjenesteordning = null,
                skalGaaAvMedAlderspensjon = "NEI",
                datoForAaGaaAvMedAlderspensjon = null,
            )

        db.lagreInntektsjustering(VAKKER_PENN, foersteInntektsjustering)

        val foersteResult = db.hentInntektsjusteringForFnr(VAKKER_PENN)
        with(foersteResult!!) {
            arbeidsinntekt shouldBe 100
            afpTjenesteordning shouldBe null
            skalGaaAvMedAlderspensjon shouldBe "NEI"
            datoForAaGaaAvMedAlderspensjon shouldBe null
        }

        db.oppdaterInntektsjustering(
            foersteResult.id,
            InntektsjusteringLagre(
                arbeidsinntekt = 1000,
                naeringsinntekt = 2000,
                inntektFraUtland = 3000,
                afpInntekt = 100,
                afpTjenesteordning = "AFPTjenesteordning",
                skalGaaAvMedAlderspensjon = "JA",
                datoForAaGaaAvMedAlderspensjon = LocalDate.of(2025, 6, 10),
            ),
        )

        val andreResult = db.hentInntektsjusteringForFnr(VAKKER_PENN)
        with(andreResult!!) {
            fnr shouldBe VAKKER_PENN.value
            inntektsaar shouldBe 2025
            arbeidsinntekt shouldBe 1000
            naeringsinntekt shouldBe 2000
            inntektFraUtland shouldBe 3000
            afpInntekt shouldBe 100
            afpTjenesteordning shouldBe "AFPTjenesteordning"
            skalGaaAvMedAlderspensjon shouldBe "JA"
            datoForAaGaaAvMedAlderspensjon shouldBe LocalDate.of(2025, 6, 10)
        }
    }

    @Test
    fun `oppdatere status paa inntektsjustering`() {
        db.lagreInntektsjustering(
            VAKKER_PENN,
            InntektsjusteringLagre(
                arbeidsinntekt = 100,
                naeringsinntekt = 200,
                inntektFraUtland = 300,
                afpInntekt = 0,
                afpTjenesteordning = null,
                skalGaaAvMedAlderspensjon = "NEI",
                datoForAaGaaAvMedAlderspensjon = null,
            ),
        )

        val resultat = db.hentAlleInntektsjusteringerForStatus(InntektsjusteringStatus.LAGRET)
        resultat.size shouldBe 1

        val inntektsjustering = resultat[0]
        db.oppdaterStatusForId(inntektsjustering.id, InntektsjusteringStatus.FERDIGSTILT)
        db.hentAlleInntektsjusteringerForStatus(InntektsjusteringStatus.LAGRET).size shouldBe 0
    }

    @Test
    fun `hent inntektsjusteringer for status`() {
        db.lagreInntektsjustering(
            VAKKER_PENN,
            InntektsjusteringLagre(
                arbeidsinntekt = 100,
                naeringsinntekt = 200,
                inntektFraUtland = 300,
                afpInntekt = 0,
                afpTjenesteordning = null,
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
                afpInntekt = 0,
                afpTjenesteordning = null,
                skalGaaAvMedAlderspensjon = "NEI",
                datoForAaGaaAvMedAlderspensjon = null,
            ),
        )

        val resultat = db.hentAlleInntektsjusteringerForStatus(InntektsjusteringStatus.LAGRET)
        resultat.size shouldBe 2
        resultat[0].fnr shouldBe SPYDIG_EGG.value
        resultat[1].fnr shouldBe VAKKER_PENN.value
    }

    @Test
    fun `skal lagre inntektsjustering`() {
        val ny =
            InntektsjusteringLagre(
                arbeidsinntekt = 100,
                naeringsinntekt = 200,
                inntektFraUtland = 300,
                afpInntekt = 100,
                afpTjenesteordning = "AFPTjenesteordning",
                skalGaaAvMedAlderspensjon = "JA",
                datoForAaGaaAvMedAlderspensjon = LocalDate.of(2025, 6, 10),
            )

        db.lagreInntektsjustering(VAKKER_PENN, ny)
        val lagret = db.hentInntektsjusteringForFnr(VAKKER_PENN) ?: throw Exception()

        with(lagret) {
            id shouldNotBe null
            fnr shouldBe VAKKER_PENN.value
            inntektsaar shouldBe 2025
            arbeidsinntekt shouldBe ny.arbeidsinntekt
            naeringsinntekt shouldBe ny.naeringsinntekt
            inntektFraUtland shouldBe ny.inntektFraUtland
            afpInntekt shouldBe 100
            afpTjenesteordning shouldBe "AFPTjenesteordning"
            skalGaaAvMedAlderspensjon shouldBe "JA"
            datoForAaGaaAvMedAlderspensjon shouldBe LocalDate.of(2025, 6, 10)
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