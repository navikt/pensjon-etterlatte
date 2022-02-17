package soeknad

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.kotest.matchers.shouldBe
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadRequest
import no.nav.etterlatte.soeknad.SoeknadService
import org.junit.jupiter.api.Test

internal class SoeknadServiceTest {

    private val mockRepository = mockk<SoeknadRepository>()

    private val service = SoeknadService(mockRepository)

    private val mapper = jacksonObjectMapper()

    @Test
    fun `Gyldige søknader lagres OK som forventet`() {
        every { mockRepository.ferdigstillSoeknad(any()) } returns 1

        val request = SoeknadRequest(listOf(
            InnsendtSoeknadFixtures.gjenlevendepensjon(),
            InnsendtSoeknadFixtures.barnepensjon()
        ))

        val lagretOK = service.sendSoeknad(Foedselsnummer.of("11057523044"), request)

        lagretOK shouldBe true

        verify(exactly = 2) { mockRepository.ferdigstillSoeknad(any()) }
    }

    @Test
    fun `Hent kladd fungerer som forventet`() {
        val fnr = "24014021406"
        val lagretSoeknad = LagretSoeknad(1, fnr, """{}""")

        every { mockRepository.finnKladd(any()) } returns lagretSoeknad

        val kladd = service.hentKladd(Foedselsnummer.of(fnr))

        kladd shouldBe lagretSoeknad

        verify(exactly = 1) { mockRepository.finnKladd(fnr) }
    }

    @Test
    fun `Lagre kladd fungerer som forventet`() {
        val fnr = "24014021406"

        every { mockRepository.lagreKladd(any()) } returns LagretSoeknad(1, fnr, """{}""")

        val soeknadJsonNode = mapper.valueToTree<JsonNode>("""{}""")
        val id = service.lagreKladd(Foedselsnummer.of(fnr), soeknadJsonNode)

        verify(exactly = 1) { mockRepository.lagreKladd(any()) }

        id shouldBe 1
    }
}
