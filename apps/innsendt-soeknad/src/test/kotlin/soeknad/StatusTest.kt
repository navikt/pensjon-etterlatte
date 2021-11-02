package soeknad

import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test

internal class StatusTest {

    @Test
    fun `Antall statuser er korrekt`() {
        assertEquals(7, Status.values().size)
    }

    @Test
    fun `Innsendt funksjon returnerer korrekte statuser`() {
        val innsendt = Status.innsendt

        assertEquals(4, innsendt.size)

        val forventetInnsendt = listOf(
            Status.FERDIGSTILT.id,
            Status.SENDT.id,
            Status.ARKIVERT.id,
            Status.ARKIVERINGSFEIL.id
        )

        assertEquals(forventetInnsendt, innsendt)
    }
}