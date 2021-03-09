import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.testsupport.TestRapid
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class SjekkAlderEtterlatteTest {

    @Test
    fun opprett() {
        val inspector = TestRapid()
            .apply { SjekkAlderEtterlatte(this, SjekkAlderEtterlatteMock()) }
            .apply {
                sendTestMessage(
                    JsonMessage.newMessage(
                        mapOf(
                            "@event_name" to "person_dod",
                            "@ident" to "123",
                        )
                    )
                        .toJson()
                )
            }.inspektør

        assertEquals("456", inspector.message(0).get("@ident").asText())
        assertEquals("etterlatt_barn_identifisert", inspector.message(0).get("@event_name").asText())
        assertEquals("456", inspector.message(0).get("@ident").asText())
        assertEquals("789", inspector.message(1).get("@ident").asText())

    }
}

class SjekkAlderEtterlatteMock : SjekkAlderForEtterlatte {
    override suspend fun sjekkAlderForEtterlatte(forelder: String): List<String> {
        return listOf("456", "789")
    }
}