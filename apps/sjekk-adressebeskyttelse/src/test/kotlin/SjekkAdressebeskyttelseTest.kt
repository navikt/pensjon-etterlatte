package no.nav.etterlatte

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.testsupport.TestRapid
import org.junit.jupiter.api.Assertions.assertEquals

class FinnAdressebeskyttelseTest {

    //@Test
    fun opprett() {
        val inspector = TestRapid()
            .apply { SjekkAdressebeskyttelse(this, FinnAdressebeskyttelseMock()) }
            .apply {
                sendTestMessage(
                    JsonMessage.newMessage(
                        mapOf(
                            "@event_name" to "soeknad_innsendt",
                            "@fnr_liste" to listOf("07106123912","131312342")
                        )
                    )
                        .toJson()
                )
            }.inspektør

        assertEquals("STRENGT_FORTROLIG", inspector.message(0).get("@adressebeskyttelse").asText())
        //assertEquals("etterlatt_barn_identifisert", inspector.message(0).get("@event_name").asText())
        //assertEquals("456", inspector.message(0).get("@etterlatt_ident").asText())
        //assertEquals("789", inspector.message(1).get("@etterlatt_ident").asText())

    }
    //@Test
    fun oppretteDummytest() {

        val bah = javaClass.getResource("mockOne.json").readText().replace(Regex("[\n\t]"), "")
        println(bah)
    }
}



class FinnAdressebeskyttelseMock : FinnAdressebeskyttelseForFnr {
    override suspend fun finnAdressebeskyttelseForFnr(identer: List<String>): JsonNode {
        val mapper = ObjectMapper()
        var response = getTestResource("/mockOne.json")

        val newNode: JsonNode = mapper.readTree(response)

        return newNode
    }
    fun getTestResource(file: String): String {
        println(file)
        return javaClass.getResource(file).readText().replace(Regex("[\n\t]"), "")
    }
}


