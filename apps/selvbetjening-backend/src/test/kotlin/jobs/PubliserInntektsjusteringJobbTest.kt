package jobs

import io.mockk.Runs
import io.mockk.every
import io.mockk.just
import io.mockk.mockk
import io.mockk.verify
import no.nav.etterlatte.funksjonsbrytere.FeatureToggleService
import no.nav.etterlatte.inntektsjustering.InntektsjusteringService
import no.nav.etterlatte.jobs.PubliserInntektsjusteringJobb
import no.nav.etterlatte.jobs.PubliserInntektsjusteringStatus
import no.nav.etterlatte.kafka.KafkaProdusent
import no.nav.etterlatte.libs.common.inntektsjustering.Inntektsjustering
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import java.time.Instant
import java.util.UUID

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
internal class PubliserInntektsjusteringJobbTest {
    private lateinit var rapid: KafkaProdusent<String, String>
    private lateinit var inntektsjusteringService: InntektsjusteringService
    private lateinit var publiserJobb: PubliserInntektsjusteringJobb
    private lateinit var featureToggleService: FeatureToggleService

    @BeforeEach
    fun setup() {
        rapid = mockk(relaxed = true)
        inntektsjusteringService = mockk(relaxed = true)
        featureToggleService = mockk(relaxed = true)
        publiserJobb = PubliserInntektsjusteringJobb(rapid, inntektsjusteringService, featureToggleService)
    }

    @Test
    fun `skal publisere inntektsjusteringer og oppdatere status`() {
        val inntektsjustering =
            Inntektsjustering(
                id = UUID.randomUUID(),
                fnr = "12345678901",
                inntektsaar = 2024,
                arbeidsinntekt = 100,
                naeringsinntekt = 200,
                inntektFraUtland = 300,
                afpInntekt = 0,
                afpTjenesteordning = null,
                skalGaaAvMedAlderspensjon = "NEI",
                datoForAaGaaAvMedAlderspensjon = null,
                tidspunkt = Instant.now(),
            )

        every { inntektsjusteringService.hentInntektsjusteringForStatus(any()) } returns listOf(inntektsjustering)
        every { inntektsjusteringService.oppdaterStatusForId(any(), any()) } just Runs

        publiserJobb.publiserInntektsjusteringer()

        verify(exactly = 1) {
            rapid.publiser(any(), any())
            inntektsjusteringService.oppdaterStatusForId(
                inntektsjustering.id,
                PubliserInntektsjusteringStatus.PUBLISERT,
            )
        }
    }
}