package no.nav.etterlatte

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonTypeRef
import io.mockk.clearAllMocks
import io.mockk.coEvery
import io.mockk.mockk
import no.nav.etterlatte.libs.common.pdl.AdressebeskyttelseResponse
import no.nav.etterlatte.libs.common.pdl.Gradering
import no.nav.etterlatte.libs.common.pdl.AdressebeskyttelseKlient
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.helse.rapids_rivers.testsupport.TestRapid
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test

internal class FinnAdressebeskyttelseTest {

    private val klientMock = mockk<AdressebeskyttelseKlient>()
    private val service = AdressebeskyttelseService(klientMock)

    private val hendelseJson = javaClass.getResource("/OppdaterJournalpostInfoTest1.json")!!.readText()

    @AfterEach
    fun afterEach() {
        clearAllMocks()
    }

    @Test
    fun testFeltMapping() {
        coEvery { klientMock.finnAdressebeskyttelseForFnr(any()) } returns opprettRespons(
            Gradering.FORTROLIG,
            Gradering.STRENGT_FORTROLIG
        )

        val inspector = TestRapid()
            .apply { SjekkAdressebeskyttelse(this, service) }
            .apply { sendTestMessage(hendelseJson) }
            .inspektør

        assertEquals(
            Gradering.STRENGT_FORTROLIG.name,
            inspector.message(0).get("@adressebeskyttelse").asText()
        )
    }

    @Test
    fun testTomResponse() {
        coEvery { klientMock.finnAdressebeskyttelseForFnr(any()) } returns opprettRespons()

        val inspector = TestRapid()
            .apply { SjekkAdressebeskyttelse(this, service) }
            .apply { sendTestMessage(hendelseJson) }
            .inspektør

        assertEquals(
            Gradering.UGRADERT.name,
            inspector.message(0).get("@adressebeskyttelse").asText()
        )
    }

    @Test
    fun testenTomOgEnVanlig() {
        coEvery { klientMock.finnAdressebeskyttelseForFnr(any()) } returns opprettRespons(
            Gradering.UGRADERT,
            Gradering.STRENGT_FORTROLIG_UTLAND
        )

        val inspector = TestRapid()
            .apply { SjekkAdressebeskyttelse(this, service) }
            .apply { sendTestMessage(hendelseJson) }
            .inspektør

        assertEquals(
            Gradering.STRENGT_FORTROLIG_UTLAND.name,
            inspector.message(0).get("@adressebeskyttelse").asText()
        )
    }

    @Test
    fun `Skal finne alle gyldige fødselsnummer i søknaden`() {
        val gyldigeFoedselsnummer = listOf(
            "07106123912", "14106126780", "21929774873", "61929750062", "61483601467", "29507030252"
        ).map { Foedselsnummer.of(it) }

        val resultat: List<Foedselsnummer> = jacksonObjectMapper().readTree(hendelseJson).finnFoedselsnummer()
        assertEquals(resultat.size, gyldigeFoedselsnummer.size)
        assertTrue(resultat.containsAll(gyldigeFoedselsnummer))
    }

    private fun opprettRespons(vararg gradering: Gradering): AdressebeskyttelseResponse {
        val graderingString = gradering.joinToString { "{\"gradering\" : \"$it\"}" }

        val json = """
            {
              "data": {
                "hentPersonBolk": [
                  {
                    "ident": "12345678910",
                    "person": { "adressebeskyttelse": [$graderingString] }
                  }
                ]
              }
            }
        """

        return jacksonObjectMapper().readValue(json, jacksonTypeRef())
    }
}
