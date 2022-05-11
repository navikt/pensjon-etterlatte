package jobs

import io.kotest.matchers.shouldBe
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import io.prometheus.client.CollectorRegistry
import no.nav.etterlatte.jobs.TilstandsProbe
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import soeknad.PostgresSoeknadRepository
import soeknad.RapportLinje
import soeknad.Status
import java.time.LocalDateTime

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
internal class TilstandsProbeTest {
    private val dbMock = mockk<PostgresSoeknadRepository>()
    private val tilstandsProbe = TilstandsProbe(dbMock)
    private val eldsteUsendt = LocalDateTime.now().minusHours(1)
    private val eldsteUarkivert = LocalDateTime.now().minusHours(2)
    private val kildeBP = "barnepensjon-ui"
    private val kildeGP = "gjenlevendepensjon-ui"

    @BeforeAll
    fun setUp() {
        every { dbMock.eldsteUsendte() } returns eldsteUsendt
        every { dbMock.eldsteUarkiverte() } returns eldsteUarkivert
        every { dbMock.rapport() } returns listOf(RapportLinje(Status.FERDIGSTILT, kildeBP, "12"), RapportLinje(Status.SENDT, kildeGP, "34"))
        every { dbMock.kilder() } returns mapOf(kildeBP to 40L, kildeGP to 25L)
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
            arrayOf("tilstand", "kilde"),
            arrayOf(Status.FERDIGSTILT.name, kildeBP)
        ) shouldBe 12.0
        CollectorRegistry.defaultRegistry.getSampleValue(
            "soknad_tilstand",
            arrayOf("tilstand", "kilde"),
            arrayOf(Status.SENDT.name, kildeGP)
        ) shouldBe 34.0
        verify(exactly = 1) { dbMock.kilder() }
        CollectorRegistry.defaultRegistry.getSampleValue(
            "soknad_kilde",
            arrayOf("kilde"),
            arrayOf(kildeBP)
        ) shouldBe 40.0
        CollectorRegistry.defaultRegistry.getSampleValue(
            "soknad_kilde",
            arrayOf("kilde"),
            arrayOf(kildeGP)
        ) shouldBe 25.0
        verify(exactly = 1) { dbMock.ukategorisert() }
    }
}
