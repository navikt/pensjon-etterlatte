package no.nav.etterlatte

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import no.nav.helse.rapids_rivers.testsupport.TestRapid
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class FinnAdressebeskyttelseTest {

    @Test
    fun testFeltMapping() {
        val json = getTestResource("/OppdaterJournalpostInfoTest1.json")
        val inspector = TestRapid()
            .apply { SjekkAdressebeskyttelse(this, FinnAdressebeskyttelseMock("/pdlMock1.json")) }
            .apply {
                sendTestMessage(
                    json
                )
            }.inspektør

        assertEquals("STRENGT_FORTROLIG", inspector.message(0).get("@adressebeskyttelse").asText())

    }

    @Test
    fun testTomResponse() {
        val json = getTestResource("/OppdaterJournalpostInfoTest1.json")
        val inspector = TestRapid()
            .apply { SjekkAdressebeskyttelse(this, FinnAdressebeskyttelseMock("/pdlMock2.json")) }
            .apply {
                sendTestMessage(
                    json
                )
            }.inspektør

        assertEquals("INGEN_BESKYTTELSE", inspector.message(0).get("@adressebeskyttelse").asText())

    }

    @Test
    fun testIkkeForstaaeligRetur() {
        val json = getTestResource("/OppdaterJournalpostInfoTest1.json")
        val inspector = TestRapid()
            .apply { SjekkAdressebeskyttelse(this, FinnAdressebeskyttelseMock("/pdlMock3.json")) }
            .apply {
                sendTestMessage(
                    json
                )
            }.inspektør

        assertEquals("STRENGT_FORTROLIG", inspector.message(0).get("@adressebeskyttelse").asText())

    }

    @Test
    fun testenTomOgEnVanlig() {
        val json = getTestResource("/OppdaterJournalpostInfoTest1.json")
        val inspector = TestRapid()
            .apply { SjekkAdressebeskyttelse(this, FinnAdressebeskyttelseMock("/pdlMock4.json")) }
            .apply {
                sendTestMessage(
                    json
                )
            }.inspektør

        assertEquals("STRENGT_FORTROLIG_UTLAND", inspector.message(0).get("@adressebeskyttelse").asText())

    }
    @Test
    fun faktiskTomRetur() {
        val json = getTestResource("/OppdaterJournalpostInfoTest1.json")
        val inspector = TestRapid()
            .apply { SjekkAdressebeskyttelse(this, FinnAdressebeskyttelseMock("/pdl-faktisk.json")) }
            .apply {
                sendTestMessage(
                    json
                )
            }.inspektør

        assertEquals("INGEN_BESKYTTELSE", inspector.message(0).get("@adressebeskyttelse").asText())

    }

    fun getTestResource( file: String): String {
        return javaClass.getResource(file).readText().replace(Regex("[\n\t]"), "")
    }

}


class FinnAdressebeskyttelseMock(val file: String) : FinnAdressebeskyttelseForFnr {
    override suspend fun finnAdressebeskyttelseForFnr(identer: List<String>): JsonNode {
        val mapper = ObjectMapper()
        val response = getTestResource(file)

        val newNode: JsonNode = mapper.readTree(response)

        return newNode
    }
    fun getTestResource( file: String): String {
        return javaClass.getResource(file).readText().replace(Regex("[\n\t]"), "")
    }
}


