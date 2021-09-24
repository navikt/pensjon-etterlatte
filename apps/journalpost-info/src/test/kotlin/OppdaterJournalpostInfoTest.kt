package no.nav.etterlatte

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import no.nav.etterlatte.libs.common.journalpost.JournalpostInfo
import no.nav.etterlatte.libs.common.pdl.Gradering
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.MessageProblems
import no.nav.helse.rapids_rivers.isMissingOrNull
import no.nav.helse.rapids_rivers.testsupport.TestRapid
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows

internal class OppdaterJournalpostInfoTest {
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
    fun testAdressebeskyttelseMangler() {
        val json = getTestResource("/adressebeskyttelseErNull.json")
        val inspector = TestRapid()
            .apply { OppdaterJournalpostInfo(this) }
            .apply {
                sendTestMessage(
                    json
                )
            }.inspektør

        assertEquals(0, inspector.size, "Meldingslisten skulle vært tom når @adressebeskyttelse mangler")
    }

    @Test
    fun testAdressebeskyttelseErUgyldig() {
        val json = getTestResource("/adressebeskyttelseErUgyldig.json")

        assertThrows<IllegalArgumentException> {
            TestRapid()
                .apply { OppdaterJournalpostInfo(this) }
                .apply {
                    sendTestMessage(
                        json
                    )
                }
        }
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
            this["@adressebeskyttelse"] = Gradering.STRENGT_FORTROLIG_UTLAND
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

        parameters[0] = ObjectMapper().readTree("\"${Gradering.STRENGT_FORTROLIG.name}\"")
        val result = method.invoke(oppdaterJpI, *parameters) as String
        assertEquals(result, Enhet.VIKAFOSSEN)

        parameters[0] = ObjectMapper().readTree("\"${Gradering.STRENGT_FORTROLIG_UTLAND.name}\"")
        val result2 = method.invoke(oppdaterJpI, *parameters) as String
        assertEquals(result2, Enhet.VIKAFOSSEN)
    }
}
