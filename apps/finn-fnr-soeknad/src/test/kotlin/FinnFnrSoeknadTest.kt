package no.nav.etterlatte

import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.testsupport.TestRapid
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class FinnFnrSoeknadTest {

    @Test
    fun opprett() {
        val json = """
    {
        "soeker": {
            "fornavn": "Test",
            "etternavn": "Testesen",
            "fnr": "24014021406"
        },
        "avdoed": {
            "fornavn": "Død",
            "etternavn": "Dødesen",
            "fnr": "12341234123"
        },
        "andreTall": {
            "kode": "12121212121212",
            "skalIkkeBliMed": "00059581835823582385",
            "skalIkkeBliMed2": "1234"
        }
    }
""".trimIndent()

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

        assertEquals("24014021406, 12341234123", inspector.message(0).get("@fnr_liste").asText())
    }
}
