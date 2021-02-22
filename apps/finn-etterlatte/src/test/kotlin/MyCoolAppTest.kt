import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageProblems
import no.nav.helse.rapids_rivers.testsupport.TestRapid
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.Assertions.*

class MyCoolAppTest {

    @Test
    fun opprett(){
        val inspector = TestRapid()
            .apply { MyCoolApp(this, FinnEtterlatteMock()) }
            .apply {
                sendTestMessage(
                    JsonMessage.newMessage(mapOf(
                      "@event_name" to "person_dod",
                      "@ident" to "123",
                    ))
                        .toJson())
            }.inspektør

        println(inspector.message(0))

        assertEquals("456", inspector.message(0).get("ident").asText())
        assertEquals("789", inspector.message(1).get("ident").asText())

    }
}

class FinnEtterlatteMock():FinnEtterlatteForPerson {
    override fun finnEtterlatteForPerson(): List<String> {
        return listOf("456", "789")
    }
}