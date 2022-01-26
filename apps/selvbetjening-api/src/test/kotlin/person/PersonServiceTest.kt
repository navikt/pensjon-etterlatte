package person

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonTypeRef
import io.ktor.features.NotFoundException
import io.mockk.clearAllMocks
import io.mockk.coEvery
import io.mockk.coVerify
import io.mockk.mockk
import kotlinx.coroutines.runBlocking
import no.nav.etterlatte.kodeverk.KodeverkService
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.person.PersonKlient
import no.nav.etterlatte.person.PersonService
import no.nav.etterlatte.person.krr.DigitalKontaktinformasjon
import no.nav.etterlatte.person.krr.KrrKlient
import no.nav.etterlatte.person.pdl.PersonResponse
import no.nav.etterlatte.person.pdl.Sivilstandstype
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNull
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

internal class PersonServiceTest {

    private companion object {
        private const val TREIG_FLOSKEL = "04096222195"
        private const val TRIVIELL_MIDTPUNKT = "19040550081"
    }

    private val mapper = jacksonObjectMapper()
        .configure(DeserializationFeature.READ_UNKNOWN_ENUM_VALUES_AS_NULL, true)
        .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
        .registerModule(JavaTimeModule())

    private val personKlient = mockk<PersonKlient>()
    private val krrKlient = mockk<KrrKlient>() {
        coEvery { hentDigitalKontaktinformasjon(any()) } returns null
    }
    private val kodeverkService = mockk<KodeverkService> {
        coEvery { hentPoststed("0380") } returns "Skåla"
        coEvery { hentPoststed(null) } returns null
        coEvery { hentLand(any()) } returns "Norge"
    }

    private val service = PersonService(personKlient, kodeverkService, krrKlient)

    @AfterEach
    fun afterEach() {
        coVerify(exactly = 1) { personKlient.hentPerson(any()) }
        clearAllMocks()
    }

    @Test
    fun `Komplett person mappes korrekt`() {
        coEvery { personKlient.hentPerson(any()) } returns opprettResponse("/pdl/personResponse.json")
        coEvery { krrKlient.hentDigitalKontaktinformasjon(any()) } returns opprettDigitalKontaktInfo()

        val person = runBlocking {
            service.hentPerson(Foedselsnummer.of(TRIVIELL_MIDTPUNKT))
        }

        assertEquals("TRIVIELL", person.fornavn)
        assertEquals("MIDTPUNKT", person.etternavn)
        assertEquals(TRIVIELL_MIDTPUNKT, person.foedselsnummer.value)
        assertEquals(2005, person.foedselsaar)
        assertEquals("2005-04-19", person.foedselsdato)

        assertEquals("Hamnavikvegen", person.adresse)
        assertEquals("30", person.husnummer)
        assertNull(person.husbokstav)
        assertEquals("0380", person.postnummer)
        assertEquals("Skåla", person.poststed)
        assertEquals("Norge", person.statsborgerskap)
        assertEquals(false, person.adressebeskyttelse)
        assertEquals("noreply@nav.no", person.epost)
        assertEquals("11111111", person.telefonnummer)
        assertEquals("nb", person.spraak)
        assertNull(person.sivilstatus)
    }

    @Test
    fun `Person med sivilstand-historikk mappes korrekt`() {
        coEvery { personKlient.hentPerson(any()) } returns opprettResponse("/pdl/endretSivilstand.json")

        val person = runBlocking {
            service.hentPerson(Foedselsnummer.of(TRIVIELL_MIDTPUNKT))
        }

        assertEquals(Sivilstandstype.ENKE_ELLER_ENKEMANN.name, person.sivilstatus)
    }

    @Test
    fun `Person med adressebeskyttelse mappes korrekt`() {
        coEvery { personKlient.hentPerson(any()) } returns opprettResponse("/pdl/adressebeskyttetPerson.json")

        val person = runBlocking {
            service.hentPerson(Foedselsnummer.of(TRIVIELL_MIDTPUNKT))
        }

        assertEquals(true, person.adressebeskyttelse)
        assertNull(person.adresse)
        assertNull(person.husbokstav)
        assertNull(person.husnummer)
        assertNull(person.postnummer)
        assertNull(person.poststed)
    }

    @Test
    fun `Person ikke finnes kaster exception`() {
        coEvery { personKlient.hentPerson(any()) } returns PersonResponse(data = null, errors = emptyList())

        assertThrows<NotFoundException> {
            runBlocking {
                service.hentPerson(Foedselsnummer.of(TREIG_FLOSKEL))
            }
        }
    }

    private fun opprettResponse(fil: String): PersonResponse {
        val json = javaClass.getResource(fil)!!.readText()

        return mapper.readValue(json, jacksonTypeRef())
    }

    private fun opprettDigitalKontaktInfo(): DigitalKontaktinformasjon = DigitalKontaktinformasjon(
        personident = TRIVIELL_MIDTPUNKT,
        aktiv = true,
        kanVarsles = true,
        reservert = false,
        spraak = "nb",
        epostadresse = "noreply@nav.no",
        mobiltelefonnummer = "11111111",
        sikkerDigitalPostkasse = null
    )
}
