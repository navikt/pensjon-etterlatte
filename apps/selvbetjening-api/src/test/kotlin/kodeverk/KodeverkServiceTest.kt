package no.nav.etterlatte.kodeverk

import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.mockk
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.common.mapJsonToAny
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test

internal class KodeverkServiceTest {

    private val mockKlient = mockk<KodeverkKlient>()

    private val service = KodeverkService(mockKlient)

    @Nested
    inner class Landkoder {
        @Test
        fun `Uthentet land mappes som forventet`() {
            coEvery { mockKlient.hentLandkoder() } returns opprettLandkoderResponse()

            runBlocking {
                val land = service.hentLand("NOR")

                assertEquals("Norge", land)
            }

            coVerify(exactly = 1) { mockKlient.hentLandkoder() }
        }

        @Test
        fun `Landkode mangler`() {
            runBlocking {
                val land = service.hentLand("")

                assertNull(land)
            }

            coVerify(exactly = 0) { mockKlient.hentLandkoder() }
        }

        @Test
        fun `Cache for landkode fungerer`() {
            coEvery { mockKlient.hentLandkoder() } returns opprettLandkoderResponse()

            runBlocking {
                val norge = service.hentLand("NOR")
                assertEquals("Norge", norge)

                val sverige = service.hentLand("SWE")
                assertEquals("Sverige", sverige)

                val cuba = service.hentLand("CUB")
                assertEquals("Cuba", cuba)
            }

            coVerify(exactly = 1) { mockKlient.hentLandkoder() }
        }

        @Test
        fun `Hent alle landkoder`() {
            coEvery { mockKlient.hentLandkoder() } returns opprettLandkoderResponse()

            runBlocking {
                val land = service.hentAlleLand()

                assertEquals(5, land.size)

                val forventedeLand = listOf("Cuba", "Polen", "Sverige", "Island", "Norge")
                assertEquals(forventedeLand, land)
            }
        }
    }


    @Nested
    inner class Postnummer {
        @Test
        fun `Uthentet postnummer mappes som forventet`() {
            coEvery { mockKlient.hentPostnummer() } returns opprettPostnummerResponse()

            runBlocking {
                val poststed = service.hentPoststed("4920")

                assertEquals("Staubø", poststed)
            }

            coVerify(exactly = 1) { mockKlient.hentPostnummer() }
        }

        @Test
        fun `Mangler postnummer, null eller blankt`() {
            runBlocking {
                val poststed = service.hentPoststed("")

                assertNull(poststed)
            }

            coVerify(exactly = 0) { mockKlient.hentPostnummer() }
        }

        @Test
        fun `Cache for postnummer fungerer`() {
            coEvery { mockKlient.hentPostnummer() } returns opprettPostnummerResponse()

            runBlocking {
                val gjeving = service.hentPoststed("4912")
                assertEquals("Gjeving", gjeving)

                val risoer = service.hentPoststed("4951")
                assertEquals("Risør", risoer)

                val nesVerk = service.hentPoststed("4934")
                assertEquals("Nes verk", nesVerk)
            }

            coVerify(exactly = 1) { mockKlient.hentPostnummer() }
        }
    }

    @Test
    fun `Cache er separat for postnummer og landkoder`() {
        coEvery { mockKlient.hentPostnummer() } returns opprettPostnummerResponse()
        coEvery { mockKlient.hentLandkoder() } returns opprettLandkoderResponse()

        runBlocking {
            // Først sette cache for poststeder
            val gjeving = service.hentPoststed("4912")
            assertEquals("Gjeving", gjeving)

            // Deretter sette cache for landkoder
            val sverige = service.hentLand("SWE")
            assertEquals("Sverige", sverige)

            // Forsøke uthenting fra poststeder cache
            val nesVerk = service.hentPoststed("4934")
            assertEquals("Nes verk", nesVerk)

            // Forsøke uthenting fra landkoder cache
            val norge = service.hentLand("NOR")
            assertEquals("Norge", norge)
        }

        coVerify(exactly = 1) { mockKlient.hentPostnummer() }
        coVerify(exactly = 1) { mockKlient.hentLandkoder() }
    }

    private fun opprettPostnummerResponse(): KodeverkResponse {
        val json = javaClass.getResource("/kodeverk/postnummer.json")!!.readText()

        return mapJsonToAny(json)
    }

    private fun opprettLandkoderResponse(): KodeverkResponse {
        val json = javaClass.getResource("/kodeverk/landkoder.json")!!.readText()

        return mapJsonToAny(json)
    }
}
