package adressebeskyttelse

import io.mockk.coEvery
import io.mockk.mockk
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.adressebeskyttelse.AdressebeskyttelseService
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
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

internal class AdressebeskyttelseServiceTest {
    private val adressebeskyttelseKlientMock = mockk<AdressebeskyttelseKlient>()
    private val adressebeskyttelseService = AdressebeskyttelseService(adressebeskyttelseKlientMock)

    @Test
    fun `Skal gi gradering per person`() {
        coEvery { adressebeskyttelseKlientMock.finnAdressebeskyttelseForFnr(any(), any()) } returns
                AdressebeskyttelseResponse(
                    HentAdressebeskyttelse(
                        listOf(
                            mockAdressebeskyttetPerson("11057523044", Gradering.STRENGT_FORTROLIG),
                            mockAdressebeskyttetPerson("26117512737", Gradering.UGRADERT),
                            mockAdressebeskyttetPerson("26104500284", Gradering.STRENGT_FORTROLIG_UTLAND),
                            mockAdressebeskyttetPerson("24116324268", null)
                        )
                    )
                )

        runBlocking {
            val graderinger = adressebeskyttelseService.hentGradering(
                listOf(
                    Foedselsnummer.of("11057523044"),
                    Foedselsnummer.of("26117512737"),
                    Foedselsnummer.of("26104500284"),
                    Foedselsnummer.of("24116324268")
                ), SoeknadType.BARNEPENSJON
            )

            assertEquals(4, graderinger.size)
            assertTrue(graderinger[Foedselsnummer.of("11057523044")] == Gradering.STRENGT_FORTROLIG)
            assertTrue(graderinger[Foedselsnummer.of("26117512737")] == Gradering.UGRADERT)
            assertTrue(graderinger[Foedselsnummer.of("26104500284")] == Gradering.STRENGT_FORTROLIG_UTLAND)
            assertTrue(graderinger[Foedselsnummer.of("24116324268")] == Gradering.UGRADERT)
        }
    }

    @Test
    fun `Skal håndtere tom fnrListe`() {
        runBlocking {
            assertEquals(emptyMap<String, Gradering>(), adressebeskyttelseService.hentGradering(emptyList(), SoeknadType.BARNEPENSJON))
        }
    }

    @Test
    fun `Skal kaste exception dersom man ikke får noen person fra PDL`() {
        coEvery { adressebeskyttelseKlientMock.finnAdressebeskyttelseForFnr(any(),any()) } returns
                AdressebeskyttelseResponse(HentAdressebeskyttelse())

        runBlocking {
            val exception = assertThrows<Exception> {
                adressebeskyttelseService.hentGradering(listOf(Foedselsnummer.of("11057523044")), SoeknadType.BARNEPENSJON)
            }
            assertEquals("Fant ingen personer i PDL", exception.message)
        }
    }
}

private fun mockAdressebeskyttetPerson(ident: String, gradering: Gradering?) = AdressebeskyttelseBolkPerson(
    ident,
    person = AdressebeskyttelsePerson(listOf(Adressebeskyttelse(gradering)))
)
