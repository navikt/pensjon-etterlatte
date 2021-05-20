package no.nav.etterlatte

import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.testsupport.TestRapid
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class FinnFnrSoeknadTest {

    @Test
    fun opprett() {
        val inspector = TestRapid()
            .apply { FinnFnrSoeknad(this) }
            .apply {
                sendTestMessage(
                    JsonMessage.newMessage(
                        mapOf(
                            "@event_name" to "soeknad_innsendt",
                            "@skjema_info" to "12345678901",
                        )
                    )
                        .toJson()
                )
            }.inspektør

        assertEquals("12345678901", inspector.message(0).get("@fnr_liste").asText())
        //assertEquals("etterlatt_barn_identifisert", inspector.message(0).get("@event_name").asText())
        //assertEquals("456", inspector.message(0).get("@etterlatt_ident").asText())
        //assertEquals("789", inspector.message(1).get("@etterlatt_ident").asText())

    }
}

/*
class FinnFnrSoeknadMock : FinnEtterlatteForPerson {
    override suspend fun finnEtterlatteForPerson(forelder: String): List<String> {
        return listOf("456", "789")
    }
}
*/