package soeknad

import com.fasterxml.jackson.databind.JsonNode
import io.kotest.matchers.should
import io.kotest.matchers.shouldBe
import io.kotest.matchers.types.beInstanceOf
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import no.nav.etterlatte.UtkastPubliserer
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadRequest
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.libs.common.test.InnsendtSoeknadFixtures
import no.nav.etterlatte.mapper
import no.nav.etterlatte.soeknad.SoeknadConflictException
import no.nav.etterlatte.soeknad.SoeknadService
import org.junit.jupiter.api.Assertions.fail
import org.junit.jupiter.api.Test
import kotlin.random.Random

internal class SoeknadServiceTest {

    private val mockRepository = mockk<SoeknadRepository>()
    private val mockUtkastPubliserer = mockk<UtkastPubliserer>()

    private val service = SoeknadService(mockRepository, mockUtkastPubliserer)
    private val kilde = "barnepensjon-ui"

    @Test
    fun `Gyldige søknader lagres OK som forventet`() {
        every { mockRepository.finnKladd(any(), any()) } returns LagretSoeknad(Random.nextLong(), "", """{}""")
        every { mockUtkastPubliserer.publiserSlettUtkastFraMinSide(any(), any()) } returns Unit
        every { mockRepository.ferdigstillSoeknad(any()) } returns 1

        val request = SoeknadRequest(
            listOf(
                InnsendtSoeknadFixtures.gjenlevendepensjon(),
                InnsendtSoeknadFixtures.barnepensjon()
            )
        )

        val lagretOK = service.sendSoeknad(Foedselsnummer.of("11057523044"), request, kilde)

        lagretOK shouldBe true

        verify(exactly = 2) {
            mockRepository.finnKladd("11057523044", any())
            mockRepository.ferdigstillSoeknad(any())
            mockUtkastPubliserer.publiserSlettUtkastFraMinSide(any(), any())
        }
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

        every { mockRepository.finnKladd(any(), any()) } returns LagretSoeknad(Random.nextLong(), "", """{}""")
        every { mockRepository.lagreKladd(any()) } returns LagretSoeknad(1, fnr, """{}""")
        every { mockUtkastPubliserer.publiserOpprettUtkastTilMinSide(any(), any()) } returns Unit

        val soeknadJsonNode = mapper.valueToTree<JsonNode>("""{}""")
        val id = service.lagreKladd(Foedselsnummer.of(fnr), soeknadJsonNode, kilde)

        verify(exactly = 1) {
            mockRepository.lagreKladd(any())
        }

        id shouldBe 1
    }

    @Test
    fun `Send søknad for seg selv OG på vegne av andre`() {
        val gjenlevFnr = Foedselsnummer.of("24014021406")

        every { mockRepository.finnKladd(any(), any()) } returns LagretSoeknad(Random.nextLong(), "", """{}""")
        every { mockRepository.ferdigstillSoeknad(any()) } returns Random.nextLong(0, 100)
        every { mockUtkastPubliserer.publiserSlettUtkastFraMinSide(any(), any()) } returns Unit

        val request = SoeknadRequest(
            listOf(
                InnsendtSoeknadFixtures.gjenlevendepensjon(gjenlevFnr),
                InnsendtSoeknadFixtures.barnepensjon(gjenlevFnr, Foedselsnummer.of("05111850870"))
            )
        )

        val isSuccess = service.sendSoeknad(gjenlevFnr, request, kilde)

        verify(exactly = 2) {
            mockRepository.finnKladd("24014021406", any())
            mockRepository.finnKladd("05111850870", any())
            mockRepository.ferdigstillSoeknad(any())
            mockUtkastPubliserer.publiserSlettUtkastFraMinSide(any(), any())
        }
        verify(exactly = 0) { mockRepository.slettOgKonverterKladd(any(), any()) }

        isSuccess shouldBe true
    }

    @Test
    fun `Send søknad på vegne av andre`() {
        val fnr = Foedselsnummer.of("24014021406")

        every { mockRepository.finnKladd("11057523044", any()) } returns LagretSoeknad(1, "11057523044", """{}""")
        every { mockRepository.finnKladd("05111850870", any()) } returns LagretSoeknad(2, "05111850870", """{}""")
        every { mockRepository.ferdigstillSoeknad(any()) } returns Random.nextLong(0, 100)
        every { mockRepository.slettOgKonverterKladd(any(), any()) } returns Random.nextLong(0, 100)
        every { mockUtkastPubliserer.publiserSlettUtkastFraMinSide(any(), any()) } returns Unit

        val request = SoeknadRequest(
            listOf(
                InnsendtSoeknadFixtures.barnepensjon(fnr, Foedselsnummer.of("11057523044")),
                InnsendtSoeknadFixtures.barnepensjon(fnr, Foedselsnummer.of("05111850870"))
            )
        )

        val isSuccess = service.sendSoeknad(fnr, request, kilde)

        verify(exactly = 2) { mockRepository.finnKladd("11057523044", any()) }
        verify(exactly = 2) { mockRepository.finnKladd("05111850870", any()) }
        verify(exactly = 2) {
            mockRepository.ferdigstillSoeknad(any())
        }
        verify(exactly = 1) { mockRepository.slettOgKonverterKladd(fnr.value, kilde) }
        verify(exactly = 3) { mockUtkastPubliserer.publiserSlettUtkastFraMinSide(any(), any()) }

        isSuccess shouldBe true
    }

    @Test
    fun `Bruker har allerede innsendt søknad som medfører konflikt`() {
        val fnr = Foedselsnummer.of("24014021406")

        every { mockRepository.finnKladd("11057523044", any()) } returns LagretSoeknad(1, "11057523044", """{}""")
        every { mockRepository.finnKladd("05111850870", any()) } returns LagretSoeknad(2, "05111850870", """{}""").apply { status = Status.FERDIGSTILT }

        val request = SoeknadRequest(
            listOf(
                InnsendtSoeknadFixtures.barnepensjon(fnr, Foedselsnummer.of("11057523044")),
                InnsendtSoeknadFixtures.barnepensjon(fnr, Foedselsnummer.of("05111850870"))
            )
        )

        try {
            service.sendSoeknad(fnr, request, kilde)
            fail()
        } catch (e: Exception) {
            e should beInstanceOf<SoeknadConflictException>()
        }

        verify(exactly = 1) { mockRepository.finnKladd("11057523044", any()) }
        verify(exactly = 1) { mockRepository.finnKladd("05111850870", any()) }
        verify(exactly = 0) { mockRepository.ferdigstillSoeknad(any()) }
        verify(exactly = 0) { mockRepository.slettOgKonverterKladd(any(), any()) }
    }
}
