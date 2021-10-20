package common

import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.mockk
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.kodeverk.Beskrivelse
import no.nav.etterlatte.kodeverk.KodeverkKlient
import no.nav.etterlatte.kodeverk.KodeverkService
import no.nav.etterlatte.kodeverk.Betydning
import no.nav.etterlatte.kodeverk.KodeverkResponse
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Test
import java.time.LocalDate

internal class KodeverkServiceTest {

    companion object {
        private const val POSTNR_OSLO = "0689"
    }

    private val mockKlient = mockk<KodeverkKlient>()

    private val service = KodeverkService(mockKlient)

    @Test
    fun `Postnummer er null eller blankt`() {
        runBlocking {
            assertNull(service.hentPoststed(null))
            assertNull(service.hentPoststed(""))
            assertNull(service.hentPoststed(" "))
        }

        coVerify(exactly = 0) { mockKlient.hentPoststed(POSTNR_OSLO) }
    }

    @Test
    fun `Bokmaal postnr finnes med gyldig dato`() {
        coEvery { mockKlient.hentPoststed(any()) } returns KodeverkResponse(
            mapOf(
                POSTNR_OSLO to listOf(
                    Betydning(
                        gyldigFra = LocalDate.now().minusYears(5).toString(),
                        gyldigTil = LocalDate.now().plusYears(1).toString(),
                        beskrivelser = mapOf("nb" to Beskrivelse("term", tekst = "Oslo"))
                    )
                )
            )
        )

        runBlocking {
            assertEquals("Oslo", service.hentPoststed(POSTNR_OSLO))
        }

        coVerify(exactly = 1) { mockKlient.hentPoststed(POSTNR_OSLO) }
    }

    @Test
    fun `Bokmaal postnr finnes, men har ikke gyldig dato`() {
        coEvery { mockKlient.hentPoststed(any()) } returns KodeverkResponse(
            mapOf(
                POSTNR_OSLO to listOf(
                    Betydning(
                        gyldigFra = LocalDate.now().minusYears(5).toString(),
                        gyldigTil = LocalDate.now().minusDays(1).toString(),
                        beskrivelser = mapOf("nb" to Beskrivelse("term", tekst = "Oslo"))
                    )
                )
            )
        )

        runBlocking {
            assertEquals("", service.hentPoststed(POSTNR_OSLO))
        }

        coVerify(exactly = 1) { mockKlient.hentPoststed(POSTNR_OSLO) }
    }

}
