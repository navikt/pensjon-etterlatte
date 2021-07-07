package no.nav.etterlatte

import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.testsupport.TestRapid
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test

class NotifikasjonTest {

    @Test
    fun test1() {
        val inspector = TestRapid()
            .apply { Notifikasjon(this) }
            .apply {
                sendTestMessage(
                    JsonMessage.newMessage(
                        mapOf(
                            "@event_name" to "soeknad_innsendt",
                            "@dokarkivRetur" to "123456",
                            "@fnr_soeker" to "07106123912"
                        )
                    )
                        .toJson()
                )
            }.inspektør

        assertEquals("07106123912", inspector.message(0).get("@fnr_soeker").asText())
        assertEquals("Vi bekrefter å ha mottat din søknad om Etterlatteytelse", inspector.message(0).get("@notifikasjon").get("tekst").asText())
        assertEquals("", inspector.message(0).get("@notifikasjon").get("link").asText())
        assertEquals("ETTERLATTE", inspector.message(0).get("@notifikasjon").get("grupperingsId").asText())
        assertTrue(inspector.message(0).get("@notifikasjon").get("eksternVarsling").asBoolean())
        assertEquals("SMS", inspector.message(0).get("@notifikasjon").get("prefererteKanaler")[0].asText())


    }
}
