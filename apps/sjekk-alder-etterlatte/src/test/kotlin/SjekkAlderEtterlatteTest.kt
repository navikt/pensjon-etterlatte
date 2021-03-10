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
                            "@event_name" to "etterlatt_barn_identifisert",
                            "@ident" to "123",
                        )
                    )
                        .toJson()
                )
            }.inspektør

        assertEquals(12, inspector.message(0).get("@alder").asInt())
    }
}

class SjekkAlderEtterlatteMock : SjekkAlderForEtterlatte {
    override suspend fun sjekkAlderForEtterlatte(forelder: String): Int {
        return 12
    }
}