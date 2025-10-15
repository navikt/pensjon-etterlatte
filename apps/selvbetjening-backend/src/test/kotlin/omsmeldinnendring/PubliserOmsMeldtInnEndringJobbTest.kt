package omsmeldinnendring

import io.mockk.Runs
import io.mockk.every
import io.mockk.just
import io.mockk.mockk
import io.mockk.verify
import no.nav.etterlatte.funksjonsbrytere.FeatureToggleService
import no.nav.etterlatte.kafka.KafkaProdusent
import no.nav.etterlatte.libs.common.omsmeldinnendring.OmsEndring
import no.nav.etterlatte.libs.common.omsmeldinnendring.OmsMeldtInnEndring
import no.nav.etterlatte.libs.common.omsmeldinnendring.OmsMeldtInnEndringStatus
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.omsendringer.OmsMeldInnEndringService
import no.nav.etterlatte.omsendringer.PubliserOmsMeldtInnEndringJobb
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import java.util.UUID

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class PubliserOmsMeldtInnEndringJobbTest {
    private lateinit var rapid: KafkaProdusent<String, String>
    private lateinit var service: OmsMeldInnEndringService
    private lateinit var publiserJobb: PubliserOmsMeldtInnEndringJobb
    private lateinit var featureToggleService: FeatureToggleService

    @BeforeEach
    fun setup() {
        rapid = mockk(relaxed = true)
        service = mockk(relaxed = true)
        featureToggleService = mockk(relaxed = true)
        publiserJobb = PubliserOmsMeldtInnEndringJobb(rapid, service, featureToggleService)
    }

    @Test
    fun `skal publisere oms meldt inn endring og oppdatere status`() {
        val ny =
            OmsMeldtInnEndring(
                fnr = Foedselsnummer.of("09038520129"),
                endring = OmsEndring.ANNET,
                beskrivelse = "asdfasdf",
                forventetInntektTilNesteAar = null,
            )
        val forsoekt =
            ny.copy(
                id = UUID.randomUUID(),
            )

        every { service.hentEndringerMedStatus(OmsMeldtInnEndringStatus.LAGRET) } returns
            listOf(
                ny,
            )
        every { service.hentEndringerMedStatus(OmsMeldtInnEndringStatus.SENDT) } returns
            listOf(
                forsoekt,
            )
        every { service.oppdaterStatusForId(any(), any()) } just Runs

        publiserJobb.publiserNyeOgIkkeFerdigstilte()

        verify(exactly = 2) {
            rapid.publiser(any(), any())
        }
        verify(exactly = 1) {
            service.oppdaterStatusForId(ny.id, OmsMeldtInnEndringStatus.SENDT)
            service.oppdaterStatusForId(forsoekt.id, OmsMeldtInnEndringStatus.SENDT)
        }
    }
}