package no.nav.etterlatte

import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.testsupport.TestRapid
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class FinnFnrSoeknadTest {

    @Test
    fun test1() {
        val json = getTestResource("/FinnFnrSoeknadTest1.json")

        val inspector = TestRapid()
            .apply { FinnFnrSoeknad(this) }
            .apply {
                sendTestMessage(
                    JsonMessage.newMessage(
                        mapOf(
                            "@event_name" to "soeknad_innsendt",
                            "@skjema_info" to json,
                        )
                    )
                        .toJson()
                )
            }.inspektør

        assertEquals("07106123912", inspector.message(0).get("@fnr_liste")[0].asText())
        assertEquals("14106126780", inspector.message(0).get("@fnr_liste")[1].asText())
        assertEquals("21929774873", inspector.message(0).get("@fnr_liste")[2].asText())
        assertEquals("61929750062", inspector.message(0).get("@fnr_liste")[3].asText())
        assertEquals("61483601467", inspector.message(0).get("@fnr_liste")[4].asText())
        assertEquals("29507030252", inspector.message(0).get("@fnr_liste")[5].asText())

        assertEquals(6,inspector.message(0).get("@fnr_liste").size())
    }
    fun getTestResource( file: String): String {
        return javaClass.getResource(file).readText().replace(Regex("[\n\t]"), "")
    }
}
