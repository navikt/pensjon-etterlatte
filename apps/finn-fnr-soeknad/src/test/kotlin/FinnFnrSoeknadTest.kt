package no.nav.etterlatte

import io.kotest.matchers.collections.shouldContainExactly
import io.kotest.matchers.shouldBe
import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.testsupport.TestRapid
import org.junit.jupiter.api.Test

class FinnFnrSoeknadTest {
    @Test
    fun `Skal finne alle gyldige fødselsnummer i søknaden`() {
        val soeknadEksempel = getTestResource("/FinnFnrSoeknadTest1.json")
        val gyldigeFoedselsnummer = listOf(
            "07106123912", "14106126780", "21929774873", "61929750062", "61483601467", "29507030252", "98765432101"
        )

        val inspector = TestRapid()
            .apply { FinnFnrSoeknad(this) }
            .apply {
                sendTestMessage(
                    JsonMessage.newMessage(
                        mapOf(
                            "@event_name" to "soeknad_innsendt",
                            "@skjema_info" to soeknadEksempel,
                            "@fnr_soeker" to "98765432101"
                        )
                    ).toJson()
                )
            }.inspektør

        val resultat = inspector.message(0).get("@fnr_liste").map { it.asText() }
        resultat.size shouldBe 7
        resultat shouldContainExactly gyldigeFoedselsnummer
    }

    private fun getTestResource(file: String): String {
        return javaClass.getResource(file)!!.readText()
    }
}
