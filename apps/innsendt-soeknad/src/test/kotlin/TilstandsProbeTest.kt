import io.kotest.matchers.shouldBe
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import io.prometheus.client.CollectorRegistry
import no.nav.etterlatte.PostgresSoeknadRepository
import no.nav.etterlatte.Status
import no.nav.etterlatte.TilstandsProbe
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import java.time.LocalDateTime


@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class TilstandsProbeTest {
    private val dbMock = mockk<PostgresSoeknadRepository>()
    private val tilstandsProbe = TilstandsProbe(dbMock)
    private val eldsteUsendt = LocalDateTime.now().minusHours(1)
    private val eldsteUarkivert = LocalDateTime.now().minusHours(2)

    @BeforeAll
    fun setUp() {
        every { dbMock.eldsteUsendte() } returns eldsteUsendt
        every { dbMock.eldsteUarkiverte() } returns eldsteUarkivert
        every { dbMock.rapport() } returns mapOf(Status.SENDT to 45L, Status.FERDIGSTILT to 30L)
        every { dbMock.ukategorisert() } returns listOf(1L)
    }

    @Test
    fun `Skal hente relevante metrics og logge til Prometheus`() {
        tilstandsProbe.gatherMetrics()

        verify(exactly = 1) { dbMock.eldsteUsendte() }
        CollectorRegistry.defaultRegistry.getSampleValue("alder_eldste_usendte") shouldBe 60.0
        verify(exactly = 1) { dbMock.eldsteUarkiverte() }
        CollectorRegistry.defaultRegistry.getSampleValue("alder_eldste_uarkiverte") shouldBe 120.0
        verify(exactly = 1) { dbMock.rapport() }
        CollectorRegistry.defaultRegistry.getSampleValue(
            "soknad_tilstand",
            arrayOf("tilstand"),
            arrayOf(Status.SENDT.name)
        ) shouldBe 45.0
        CollectorRegistry.defaultRegistry.getSampleValue(
            "soknad_tilstand",
            arrayOf("tilstand"),
            arrayOf(Status.FERDIGSTILT.name)
        ) shouldBe 30.0
        verify(exactly = 1) { dbMock.ukategorisert() }
    }
}
