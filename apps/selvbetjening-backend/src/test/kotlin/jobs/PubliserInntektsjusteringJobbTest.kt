package jobs

import io.mockk.Runs
import io.mockk.every
import io.mockk.just
import io.mockk.mockk
import io.mockk.verify
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

    @BeforeEach
    fun setup() {
        rapid = mockk(relaxed = true)
        inntektsjusteringService = mockk(relaxed = true)
        publiserJobb = PubliserInntektsjusteringJobb(rapid, inntektsjusteringService)
    }

    @Test
    fun `skal publisere inntektsjusteringer og oppdatere status`() {
        val inntektsjustering =
            Inntektsjustering(
                id = UUID.randomUUID(),
                inntektsaar = 2024,
                arbeidsinntekt = 100,
                naeringsinntekt = 200,
                arbeidsinntektUtland = 300,
                naeringsinntektUtland = 400,
                tidspunkt = Instant.now(),
            )

        val data =
            mapOf(
                "@fnr" to "12345678901",
                "@inntektsjustering" to inntektsjustering,
            )

        every { inntektsjusteringService.hentSisteInntektsjusteringForStatus(any()) } returns listOf(data)
        every { inntektsjusteringService.oppdaterStatusForInntektsjustering(any(), any()) } just Runs

        publiserJobb.publiserInntektsjusteringer()

        verify(exactly = 1) {
            inntektsjusteringService.oppdaterDuplikateInntektsjusteringer(
                PubliserInntektsjusteringStatus.LAGRET,
                PubliserInntektsjusteringStatus.IKKE_PUBLISERT,
            )
            rapid.publiser(any(), any())
            inntektsjusteringService.oppdaterStatusForInntektsjustering(
                inntektsjustering.id,
                PubliserInntektsjusteringStatus.PUBLISERT,
            )
        }
    }
}