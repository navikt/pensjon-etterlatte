package dokarkiv

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test

internal class JournalpostModelTest {

    @Test
    fun `Tema og kanal skal alltid være satt`() {
        val request = JournalpostRequest(
            "tittel",
            "PEN",
            JournalPostType.INNGAAENDE,
            "behandlingstema",
            "enhet",
            AvsenderMottaker(id = "123"),
            Bruker(id = "123"),
            "eksternRef",
            null,
            emptyList()
        )

        assertEquals("PEN", request.tema)
        assertEquals("NAV_NO", request.kanal)
    }
}