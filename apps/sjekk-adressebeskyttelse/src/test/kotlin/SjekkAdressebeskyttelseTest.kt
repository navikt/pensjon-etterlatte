package no.nav.etterlatte

import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.testsupport.TestRapid
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class FinnAdressebeskyttelseTest {

    @Test
    fun opprett() {
        val inspector = TestRapid()
            .apply { SjekkAdressebeskyttelse(this, FinnAdressebeskyttelseMock()) }
            .apply {
                sendTestMessage(
                    JsonMessage.newMessage(
                        mapOf(
                            "@event_name" to "soeknad_innsendt",
                            "@fnr_liste" to "07106123912",
                        )
                    )
                        .toJson()
                )
            }.inspektør

        assertEquals("SUPERHEMMELIG", inspector.message(0).get("@adressebeskyttelse").asText())
        //assertEquals("etterlatt_barn_identifisert", inspector.message(0).get("@event_name").asText())
        //assertEquals("456", inspector.message(0).get("@etterlatt_ident").asText())
        //assertEquals("789", inspector.message(1).get("@etterlatt_ident").asText())

    }
}

class FinnAdressebeskyttelseMock : FinnAdressebeskyttelseForFnr {
    override suspend fun finnAdressebeskyttelseForFnr(identer: List<String>): String {
        return "SUPERHEMMELIG"
    }
}