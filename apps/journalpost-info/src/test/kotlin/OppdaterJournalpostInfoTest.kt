package no.nav.etterlatte

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import no.nav.etterlatte.libs.common.adressebeskyttelse.Adressebeskyttelse
import no.nav.etterlatte.libs.common.adressebeskyttelse.Graderinger
import no.nav.etterlatte.libs.common.journalpost.JournalpostInfo
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageProblems
import no.nav.helse.rapids_rivers.testsupport.TestRapid
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test

class OppdaterJournalpostInfoTest {
    fun getTestResource(file: String): String {
        return javaClass.getResource(file).readText().replace(Regex("[\n\t]"), "")
    }


    @Test
    fun testFeltMapping() {
        val json = getTestResource("/OppdaterJournalpostInfoTest1.json")
        val inspector = TestRapid()
            .apply { OppdaterJournalpostInfo(this) }
            .apply {
                sendTestMessage(
                    json
                )
            }.inspektør

        assertEquals(
            "12345678901",
            inspector.message(0).get("@journalpostInfo").get("avsenderMottaker").get("id").asText()
        )
        assertEquals("FNR", inspector.message(0).get("@journalpostInfo").get("avsenderMottaker").get("idType").asText())
        assertEquals("", inspector.message(0).get("@journalpostInfo").get("avsenderMottaker").get("navn").asText())
        assertEquals("12345678901", inspector.message(0).get("@journalpostInfo").get("bruker").get("id").asText())
        assertEquals("FNR", inspector.message(0).get("@journalpostInfo").get("bruker").get("idType").asText())
    }

    @Test
    fun testStrengtFortrolig() {
        val json = getTestResource("/OppdaterJournalpostInfoTest1.json")
        val inspector = TestRapid()
            .apply { OppdaterJournalpostInfo(this) }
            .apply {
                sendTestMessage(
                    json
                )
            }.inspektør
        println(inspector.message(0))
        assertEquals("2103", inspector.message(0).get("@journalpostInfo").get("journalfoerendeEnhet").asText())
    }

    @Test
    fun testFortrolig() {
        val json = getTestResource("/OppdaterJournalpostInfoTest2.json")
        val inspector = TestRapid()
            .apply { OppdaterJournalpostInfo(this) }
            .apply {
                sendTestMessage(
                    json
                )
            }.inspektør

        assertTrue(inspector.message(0).get("@journalpostInfo").get("journalfoerendeEnhet").isNull)
    }

    @Test
    fun testFortroligUtland() {
        val json = getTestResource("/OppdaterJournalpostInfoTest3.json")
        val inspector = TestRapid()
            .apply { OppdaterJournalpostInfo(this) }
            .apply {
                sendTestMessage(
                    json
                )
            }.inspektør

        assertEquals("2103", inspector.message(0).get("@journalpostInfo").get("journalfoerendeEnhet").asText())
    }

    @Test
    fun testIngenAdressebeskyttelse() {
        val json = getTestResource("/OppdaterJournalpostInfoTest4.json")
        val inspector = TestRapid()
            .apply { OppdaterJournalpostInfo(this) }
            .apply {
                sendTestMessage(
                    json
                )
            }.inspektør

        assertTrue(inspector.message(0).get("@journalpostInfo").get("journalfoerendeEnhet").isNull)
    }

    @Test
    fun `skal lage JournalpostInfo`() {
        val rapidsConnection = TestRapid()
        val oppdaterJpI = OppdaterJournalpostInfo(rapidsConnection)

        val method = oppdaterJpI::class.java.getDeclaredMethod("lagJournalpostInfo", JsonMessage::class.java)
        method.isAccessible = true
        val parameters = arrayOfNulls<Any>(1)

        parameters[0] = JsonMessage("{}", MessageProblems("{}")).apply {
            this["@fnr_soeker"] = "12345678975"
            this["@adressebeskyttelse"] = Adressebeskyttelse.KODE19
        }

        val result = method.invoke(oppdaterJpI, *parameters) as JournalpostInfo
        assertEquals(result.bruker.id, "12345678975")
        assertEquals(result.journalfoerendeEnhet, "2103")
    }

    @Test
    fun `skal returnere riktig enhet`() {
        val rapidsConnection = TestRapid()
        val oppdaterJpI = OppdaterJournalpostInfo(rapidsConnection)

        val method = oppdaterJpI::class.java.getDeclaredMethod("finnEnhet", JsonNode::class.java)
        method.isAccessible = true
        val parameters = arrayOfNulls<Any>(1)

        parameters[0] = ObjectMapper().readTree("\"STRENGT_FORTROLIG\"");
        val result = method.invoke(oppdaterJpI, *parameters) as String
        assertEquals(result, Graderinger.STRENGT_FORTROLIG.ruting)

        parameters[0] = ObjectMapper().readTree("\"STRENGT_FORTROLIG_UTLAND\"");
        val result2 = method.invoke(oppdaterJpI, *parameters) as String
        assertEquals(result2, Graderinger.STRENGT_FORTROLIG_UTLAND.ruting)
    }
}

