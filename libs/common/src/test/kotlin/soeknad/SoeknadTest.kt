package soeknad

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.matchers.equality.shouldBeEqualToComparingFields
import io.kotest.matchers.shouldBe
import no.nav.etterlatte.libs.common.soeknad.Soeknad
import org.junit.jupiter.api.Test

class SoeknadTest {
    private val mapper = jacksonObjectMapper()
    private val soeknadJson = javaClass.getResource("/mock-soeknad.json")!!.readText()
    private val soeknad: Soeknad = mapper.readValue(soeknadJson)

    @Test
    fun `Skal serialisere og deserialisere korrekt`() {
        val reserialzied: String = mapper.writeValueAsString(soeknad)

        mapper.readTree(reserialzied) shouldBeEqualToComparingFields mapper.readTree(soeknadJson)
    }

    @Test
    fun `Skal validere oppsummering ved opprettelse av søknad`() {
        val exception = shouldThrow<Exception> {
            soeknad.copy(oppsummering = soeknad.oppsummering.take(4))
        }

        exception.message shouldBe "Søknad inneholder færre grupper enn forventet"
    }

    @Test
    fun `Skal mappe oppsummeringen korrekt`() {
        val oppsummering = soeknad.oppsummering

        oppsummering.size shouldBe 5

        val omDeg = oppsummering[0]
        omDeg.tittel shouldBe "Om deg"
        omDeg.elementer.size shouldBe 2

        val omDegOgAvdoede = oppsummering[1]
        omDegOgAvdoede.tittel shouldBe "Om deg og avdøde"
        omDegOgAvdoede.elementer.size shouldBe 1

        val omDenAvdoede = oppsummering[2]
        omDenAvdoede.tittel shouldBe "Om avdøde"
        omDenAvdoede.elementer.size shouldBe 2

        val dinSituasjon = oppsummering[3]
        dinSituasjon.tittel shouldBe "Situasjonen din"
        dinSituasjon.elementer.size shouldBe 2

        val omBarn = oppsummering[4]
        omBarn.tittel shouldBe "Om barn"
        omBarn.elementer.size shouldBe 3
    }
}
