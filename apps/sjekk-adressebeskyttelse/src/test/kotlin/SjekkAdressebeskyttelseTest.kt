package no.nav.etterlatte

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonTypeRef
import no.nav.etterlatte.libs.common.pdl.AdressebeskyttelseResponse
import no.nav.etterlatte.libs.common.pdl.Gradering
import no.nav.etterlatte.pdl.AdressebeskyttelseService
import no.nav.etterlatte.pdl.Pdl
import no.nav.helse.rapids_rivers.testsupport.TestRapid
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

internal class FinnAdressebeskyttelseTest {

    @Test
    fun testFeltMapping() {
        val json = getTestResource("/OppdaterJournalpostInfoTest1.json")
        val inspector = TestRapid()
            .apply { SjekkAdressebeskyttelse(this, AdressebeskyttelseService(PdlKlientMock("/pdlMock1.json"))) }
            .apply {
                sendTestMessage(
                    json
                )
            }.inspektør

        assertEquals(
            Gradering.STRENGT_FORTROLIG.name,
            inspector.message(0).get("@adressebeskyttelse").asText()
        )
    }

    @Test
    fun testTomResponse() {
        val json = getTestResource("/OppdaterJournalpostInfoTest1.json")
        val inspector = TestRapid()
            .apply { SjekkAdressebeskyttelse(this, AdressebeskyttelseService(PdlKlientMock("/pdlMock2.json"))) }
            .apply {
                sendTestMessage(
                    json
                )
            }.inspektør

        assertEquals(
            Gradering.UGRADERT.name,
            inspector.message(0).get("@adressebeskyttelse").asText()
        )
    }

    @Test
    fun testIkkeForstaaeligRetur() {
        val json = getTestResource("/OppdaterJournalpostInfoTest1.json")

        assertThrows<Exception> {
            TestRapid()
                .apply { SjekkAdressebeskyttelse(this, AdressebeskyttelseService(PdlKlientMock("/pdlMock3.json"))) }
                .apply {
                    sendTestMessage(
                        json
                    )
                }.inspektør
        }
    }

    @Test
    fun testenTomOgEnVanlig() {
        val json = getTestResource("/OppdaterJournalpostInfoTest1.json")
        val inspector = TestRapid()
            .apply { SjekkAdressebeskyttelse(this, AdressebeskyttelseService(PdlKlientMock("/pdlMock4.json"))) }
            .apply {
                sendTestMessage(
                    json
                )
            }.inspektør

        assertEquals(
            Gradering.STRENGT_FORTROLIG_UTLAND.name,
            inspector.message(0).get("@adressebeskyttelse").asText()
        )
    }

    @Test
    fun faktiskTomRetur() {
        val json = getTestResource("/OppdaterJournalpostInfoTest1.json")
        val inspector = TestRapid()
            .apply { SjekkAdressebeskyttelse(this, AdressebeskyttelseService(PdlKlientMock("/pdl-faktisk.json"))) }
            .apply {
                sendTestMessage(
                    json
                )
            }.inspektør

        assertEquals(
            Gradering.UGRADERT.name,
            inspector.message(0).get("@adressebeskyttelse").asText()
        )
    }

    @Test
    fun faktiskTomRetur2() {
        val json = getTestResource("/OppdaterJournalpostInfoTest1.json")
        val inspector = TestRapid()
            .apply { SjekkAdressebeskyttelse(this, AdressebeskyttelseService(PdlKlientMock("/pdl-faktisk2.json"))) }
            .apply {
                sendTestMessage(
                    json
                )
            }.inspektør

        assertEquals(
            Gradering.UGRADERT.name,
            inspector.message(0).get("@adressebeskyttelse").asText()
        )
    }

    fun getTestResource( file: String): String {
        return javaClass.getResource(file).readText().replace(Regex("[\n\t]"), "")
    }

}

private class PdlKlientMock(private val file: String) : Pdl {
    override suspend fun finnAdressebeskyttelseForFnr(identer: List<String>): AdressebeskyttelseResponse {
        val mapper = jacksonObjectMapper()
        val json = getTestResource(file)

        return mapper.readValue(json, jacksonTypeRef<AdressebeskyttelseResponse>())
    }
    fun getTestResource( file: String): String {
        return javaClass.getResource(file).readText().replace(Regex("[\n\t]"), "")
    }
}


