package no.nav.etterlatte

import no.nav.helse.rapids_rivers.JsonMessage
import no.nav.helse.rapids_rivers.testsupport.TestRapid
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import java.time.LocalDate
import java.time.Month

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
                            "@etterlatt_ident" to "123",
                            "@avdod_doedsdato" to "2021-03-16"
                        )
                    )
                        .toJson()
                )
            }.inspektør

        assertEquals(35, inspector.message(0).get("@alder_ved_dodsfall").asInt())
    }
}

class SjekkAlderEtterlatteMock : SjekkAlderForEtterlatte {
    override suspend fun sjekkAlderForEtterlatte(etterlatt: String): LocalDate {
        return LocalDate.of(1986, Month.FEBRUARY, 6)
    }
}