package no.nav.etterlatte.kodeverk

import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.mockk
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.common.mapJsonToAny
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test

internal class KodeverkServiceTest {

    private val mockKlient = mockk<KodeverkKlient>()

    private val service = KodeverkService(mockKlient)

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

            assertTrue(land.isEmpty())
        }

        coVerify(exactly = 0) { mockKlient.hentLandkoder() }
    }

    private fun opprettLandkoderResponse(): KodeverkResponse {
        val json = javaClass.getResource("/kodeverk/landkoder.json")!!.readText()

        return mapJsonToAny(json)
    }
}
