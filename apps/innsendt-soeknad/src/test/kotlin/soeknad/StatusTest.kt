package soeknad

import io.kotest.matchers.shouldBe
import org.junit.jupiter.api.Test

internal class StatusTest {

    @Test
    fun `Antall statuser er korrekt`() {
        Status.values().size shouldBe 7
    }

    @Test
    fun `Innsendt funksjon returnerer korrekte statuser`() {
        val innsendt = Status.innsendt

        innsendt.size shouldBe 4

        val forventetInnsendt = listOf(
            Status.FERDIGSTILT,
            Status.SENDT,
            Status.ARKIVERT,
            Status.ARKIVERINGSFEIL
        )

        innsendt shouldBe forventetInnsendt

        val resterendeStatuser = Status.values().filterNot { it in forventetInnsendt }

        resterendeStatuser.size shouldBe 3

        val forventetResterende = listOf(
            Status.LAGRETKLADD,
            Status.SLETTET,
            Status.UTGAATT
        )

        resterendeStatuser shouldBe forventetResterende
    }
}