package no.nav.etterlatte

import io.mockk.coEvery
import io.mockk.every
import io.mockk.mockk
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadType
import no.nav.etterlatte.libs.pdl.Adressebeskyttelse
import no.nav.etterlatte.libs.pdl.AdressebeskyttelseBolkPerson
import no.nav.etterlatte.libs.pdl.AdressebeskyttelseKlient
import no.nav.etterlatte.libs.pdl.AdressebeskyttelsePerson
import no.nav.etterlatte.libs.pdl.AdressebeskyttelseResponse
import no.nav.etterlatte.libs.pdl.Gradering
import no.nav.etterlatte.libs.pdl.HentAdressebeskyttelse
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

internal class AdressebeskyttelseServiceTest {

    private val mockKlient = mockk<AdressebeskyttelseKlient>()
    private val service = AdressebeskyttelseService(mockKlient)

    private val fnr = mockk<Foedselsnummer> {
        every { value } returns "1234"
    }

    @Test
    fun `Gradering funnet og prioritert korrekt - STRENGT_FORTROLIG_UTLAND`() {
        coEvery {
            mockKlient.finnAdressebeskyttelseForFnr(any(), any())
        } returns mockResponse(Gradering.FORTROLIG, null, null, Gradering.STRENGT_FORTROLIG_UTLAND)

        runBlocking {
            val gradering = service.hentGradering(listOf(fnr), SoeknadType.BARNEPENSJON)

            assertEquals(Gradering.STRENGT_FORTROLIG_UTLAND, gradering)
        }
    }

    @Test
    fun `Gradering funnet og prioritert korrekt - STRENGT_FORTROLIG`() {
        coEvery {
            mockKlient.finnAdressebeskyttelseForFnr(any(), any())
        } returns mockResponse(Gradering.FORTROLIG, null, null, Gradering.STRENGT_FORTROLIG, null, Gradering.FORTROLIG)

        runBlocking {
            val gradering = service.hentGradering(listOf(fnr), SoeknadType.BARNEPENSJON)

            assertEquals(Gradering.STRENGT_FORTROLIG, gradering)
        }
    }

    @Test
    fun `Gradering funnet og prioritert korrekt - FORTROLIG`() {
        coEvery {
            mockKlient.finnAdressebeskyttelseForFnr(any(), any())
        } returns mockResponse(Gradering.FORTROLIG, null, null, null, Gradering.FORTROLIG)

        runBlocking {
            val gradering = service.hentGradering(listOf(fnr), SoeknadType.BARNEPENSJON)

            assertEquals(Gradering.FORTROLIG, gradering)
        }
    }

    @Test
    fun `Gradering funnet og prioritert korrekt - UGRADERT`() {
        coEvery {
            mockKlient.finnAdressebeskyttelseForFnr(any(), any())
        } returns mockResponse(null, null, null, null)

        runBlocking {
            val gradering = service.hentGradering(listOf(fnr), SoeknadType.BARNEPENSJON)

            assertEquals(Gradering.UGRADERT, gradering)
        }
    }

    @Test
    fun `Kaster feil dersom ingen personer funnet`() {
        coEvery {
            mockKlient.finnAdressebeskyttelseForFnr(any(), any())
        } returns AdressebeskyttelseResponse(HentAdressebeskyttelse(hentPersonBolk = emptyList()))

        assertThrows<Exception> {
            runBlocking {
                service.hentGradering(listOf(fnr), SoeknadType.BARNEPENSJON)
            }
        }
    }

    @Test
    fun `Kaster feil dersom ingen personer funnet del 2`() {
        coEvery {
            mockKlient.finnAdressebeskyttelseForFnr(any(), any())
        } returns AdressebeskyttelseResponse(HentAdressebeskyttelse(listOf(AdressebeskyttelseBolkPerson(ident = "test", person = null))))

        assertThrows<Exception> {
            runBlocking {
                service.hentGradering(listOf(fnr), SoeknadType.BARNEPENSJON)
            }
        }
    }

    private fun mockResponse(vararg graderinger: Gradering?) = AdressebeskyttelseResponse(
        data = HentAdressebeskyttelse(
            hentPersonBolk = listOf(
                AdressebeskyttelseBolkPerson(
                    ident = "test",
                    person = AdressebeskyttelsePerson(
                        graderinger.mapNotNull { Adressebeskyttelse(it) }
                    )
                )
            )
        )
    )
}
