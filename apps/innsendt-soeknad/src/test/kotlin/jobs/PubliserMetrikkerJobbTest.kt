package jobs

import io.kotest.matchers.shouldBe
import io.micrometer.core.instrument.Gauge
import io.micrometer.prometheusmetrics.PrometheusConfig
import io.micrometer.prometheusmetrics.PrometheusMeterRegistry
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import no.nav.etterlatte.jobs.PubliserMetrikkerJobb
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import soeknad.PostgresSoeknadRepository
import soeknad.RapportLinje
import soeknad.Status
import java.time.LocalDateTime

internal class PubliserMetrikkerJobbTest {
    private val dbMock = mockk<PostgresSoeknadRepository>()
    private val testreg = PrometheusMeterRegistry(PrometheusConfig.DEFAULT)
    private val publiserMetrikkerJobb = PubliserMetrikkerJobb(dbMock, testreg)
    private val eldsteUsendt = LocalDateTime.now().minusHours(1)
    private val eldsteUarkivert = LocalDateTime.now().minusHours(2)
    private val kildeBP = "barnepensjon-ui"
    private val kildeOMS = "omstillingsstoenad-ui"

    @BeforeEach
    fun setUp() {
        every { dbMock.eldsteUsendte() } returns eldsteUsendt
        every { dbMock.eldsteUarkiverte() } returns eldsteUarkivert
        every { dbMock.rapport() } returns
            listOf(RapportLinje(Status.FERDIGSTILT, kildeBP, 12), RapportLinje(Status.SENDT, kildeOMS, 34))
        every { dbMock.kilder() } returns mapOf(kildeBP to 40L, kildeOMS to 25L)
        every { dbMock.soeknaderMedHendelseStatus(Status.LAGRETKLADD) } returns 1500
        every { dbMock.soeknaderMedHendelseStatus(Status.FERDIGSTILT) } returns 1100
    }

    private fun metrikker(metrikk: String) = testreg.get(metrikk).gauges()

    @Test
    fun `Skal hente relevante metrics og logge til Prometheus`() {
        publiserMetrikkerJobb.oppdaterMultiGauges()

        hentVerdi(metrikker("alder_eldste_usendte")) shouldBe 60
        verify(exactly = 1) { dbMock.eldsteUsendte() }

        hentVerdi(metrikker("alder_eldste_uarkiverte")) shouldBe 120
        verify(exactly = 1) { dbMock.eldsteUarkiverte() }

        hentVerdi(
            metrikker("soknad_tilstand"),
            mapOf("tilstand" to Status.FERDIGSTILT.name, "kilde" to kildeBP),
        ) shouldBe 12

        hentVerdi(
            metrikker("soknad_tilstand"),
            mapOf("tilstand" to Status.SENDT.name, "kilde" to kildeOMS)) shouldBe 34
        verify(exactly = 1) { dbMock.rapport() }

        hentVerdi(metrikker("soknad_kilde"), mapOf("kilde" to kildeBP)) shouldBe 40
        verify(exactly = 1) { dbMock.kilder() }

        hentVerdi(metrikker("soknader_ferdigstilt")) shouldBe 1100
        verify(exactly = 1) { dbMock.soeknaderMedHendelseStatus(Status.FERDIGSTILT) }

        hentVerdi(metrikker("soknader_lagretkladd")) shouldBe 1500
        verify(exactly = 1) { dbMock.soeknaderMedHendelseStatus(Status.LAGRETKLADD) }
    }

    @Test
    fun `Skal hente oppdaterte metrics etter endringer i DB`() {
        publiserMetrikkerJobb.oppdaterMultiGauges()

        every { dbMock.eldsteUarkiverte() } returns LocalDateTime.now().minusHours(2)
        hentVerdi(metrikker("alder_eldste_uarkiverte")) shouldBe 120

        every { dbMock.eldsteUarkiverte() } returns LocalDateTime.now().minusHours(4)
        hentVerdi(metrikker("alder_eldste_uarkiverte")) shouldBe 240
    }
}

private fun hentVerdi(
    metrikker: Collection<Gauge>,
    tags: Map<String, String> = mapOf(),
) = metrikker.filter { metrikk -> tags.all { metrikk.id.getTag(it.key) == it.value } }.sumOf { it.value() }.toInt()