package soeknad

import com.fasterxml.jackson.databind.JsonNode
import io.kotest.matchers.shouldBe
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadRequest
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.mapper
import no.nav.etterlatte.soeknad.SoeknadService
import org.junit.jupiter.api.Test
import kotlin.random.Random

internal class SoeknadServiceTest {

    private val mockRepository = mockk<SoeknadRepository>()

    private val service = SoeknadService(mockRepository)
    private val kilde = "barnepensjon-ui"

    @Test
    fun `Gyldige søknader lagres OK som forventet`() {
        every { mockRepository.ferdigstillSoeknad(any()) } returns 1

        val request = SoeknadRequest(
            listOf(
                InnsendtSoeknadFixtures.gjenlevendepensjon(),
                InnsendtSoeknadFixtures.barnepensjon()
            )
        )

        val lagretOK = service.sendSoeknad(Foedselsnummer.of("11057523044"), request, kilde)

        lagretOK shouldBe true

        verify(exactly = 2) { mockRepository.ferdigstillSoeknad(any()) }
    }

    @Test
    fun `Hent kladd fungerer som forventet`() {
        val fnr = "24014021406"
        val lagretSoeknad = LagretSoeknad(1, fnr, """{}""")

        every { mockRepository.finnKladd(any(), any()) } returns lagretSoeknad

        val kladd = service.hentKladd(Foedselsnummer.of(fnr), kilde)

        kladd shouldBe lagretSoeknad

        verify(exactly = 1) { mockRepository.finnKladd(fnr, kilde) }
    }

    @Test
    fun `Lagre kladd fungerer som forventet`() {
        val fnr = "24014021406"

        every { mockRepository.lagreKladd(any()) } returns LagretSoeknad(1, fnr, """{}""")

        val soeknadJsonNode = mapper.valueToTree<JsonNode>("""{}""")
        val id = service.lagreKladd(Foedselsnummer.of(fnr), soeknadJsonNode, kilde)

        verify(exactly = 1) { mockRepository.lagreKladd(any()) }

        id shouldBe 1
    }

    @Test
    fun `Send søknad for seg selv OG på vegne av andre`() {
        val gjenlevFnr = Foedselsnummer.of("24014021406")

        every { mockRepository.ferdigstillSoeknad(any()) } returns Random.nextLong(0, 100)

        val request = SoeknadRequest(
            listOf(
                InnsendtSoeknadFixtures.gjenlevendepensjon(gjenlevFnr),
                InnsendtSoeknadFixtures.barnepensjon(gjenlevFnr, Foedselsnummer.of("05111850870"))
            )
        )

        val isSuccess = service.sendSoeknad(gjenlevFnr, request, kilde)

        verify(exactly = 2) { mockRepository.ferdigstillSoeknad(any()) }
        verify(exactly = 0) { mockRepository.slettOgKonverterKladd(any(), any()) }

        isSuccess shouldBe true
    }

    @Test
    fun `Send søknad på vegne av andre`() {
        val fnr = Foedselsnummer.of("24014021406")

        every { mockRepository.ferdigstillSoeknad(any()) } returns Random.nextLong(0, 100)
        every { mockRepository.slettOgKonverterKladd(any(), any()) } returns Random.nextLong(0, 100)

        val request = SoeknadRequest(
            listOf(
                InnsendtSoeknadFixtures.barnepensjon(fnr, Foedselsnummer.of("11057523044")),
                InnsendtSoeknadFixtures.barnepensjon(fnr, Foedselsnummer.of("05111850870"))
            )
        )

        val isSuccess = service.sendSoeknad(fnr, request, kilde)

        verify(exactly = 2) { mockRepository.ferdigstillSoeknad(any()) }
        verify(exactly = 1) { mockRepository.slettOgKonverterKladd(fnr.value, kilde) }

        isSuccess shouldBe true
    }
}
