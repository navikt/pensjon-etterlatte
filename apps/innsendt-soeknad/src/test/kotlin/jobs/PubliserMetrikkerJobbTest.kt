package jobs

import io.kotest.matchers.shouldBe
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import io.prometheus.client.CollectorRegistry
import no.nav.etterlatte.jobs.PubliserMetrikkerJobb
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import soeknad.PostgresSoeknadRepository
import soeknad.RapportLinje
import soeknad.Status
import java.time.LocalDateTime

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
internal class PubliserMetrikkerJobbTest {
    private val dbMock = mockk<PostgresSoeknadRepository>()
    private val publiserMetrikkerJobb = PubliserMetrikkerJobb(dbMock)
    private val eldsteUsendt = LocalDateTime.now().minusHours(1)
    private val eldsteUarkivert = LocalDateTime.now().minusHours(2)
    private val kildeBP = "barnepensjon-ui"
    private val kildeOMS = "omstillingsstoenad-ui"

    @BeforeAll
    fun setUp() {
        every { dbMock.eldsteUsendte() } returns eldsteUsendt
        every { dbMock.eldsteUarkiverte() } returns eldsteUarkivert
        every { dbMock.rapport() } returns listOf(RapportLinje(Status.FERDIGSTILT, kildeBP, "12"), RapportLinje(Status.SENDT, kildeOMS, "34"))
        every { dbMock.kilder() } returns mapOf(kildeBP to 40L, kildeOMS to 25L)
        every { dbMock.ukategorisert() } returns listOf(1L)
    }

    @Test
    fun `Skal hente relevante metrics og logge til Prometheus`() {
        publiserMetrikkerJobb.publiserMetrikker()

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
            arrayOf(Status.SENDT.name, kildeOMS)
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
            arrayOf(kildeOMS)
        ) shouldBe 25.0
        verify(exactly = 1) { dbMock.ukategorisert() }
    }
}
