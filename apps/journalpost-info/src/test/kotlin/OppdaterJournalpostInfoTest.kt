package no.nav.etterlatte

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import no.nav.etterlatte.libs.common.journalpost.JournalpostInfo
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageProblems
import no.nav.helse.rapids_rivers.testsupport.TestRapid
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

class OppdaterJournalpostInfoTest {
    fun getTestResource( file: String): String {
            return javaClass.getResource(file).readText().replace(Regex("[\n\t]"), "")
        }

    @Test
    fun test1() {
        val json = getTestResource("/OppdaterJournalpostInfoTest1.json")
        val inspector = TestRapid()
            .apply { OppdaterJournalpostInfo(this) }
            .apply {
                sendTestMessage(
                    json
                )
            }.inspektør

        assertEquals("2103", inspector.message(0).get("@journalpostInfo").get("journalfoerendeEnhet").asText())
        assertEquals("12345678901", inspector.message(0).get("@journalpostInfo").get("avsenderMottaker").get("id").asText())
        assertEquals("FNR", inspector.message(0).get("@journalpostInfo").get("avsenderMottaker").get("idType").asText())
        assertEquals("", inspector.message(0).get("@journalpostInfo").get("avsenderMottaker").get("navn").asText())
        assertEquals("12345678901", inspector.message(0).get("@journalpostInfo").get("bruker").get("id").asText())
        assertEquals("FNR", inspector.message(0).get("@journalpostInfo").get("bruker").get("idType").asText())
    }
}

