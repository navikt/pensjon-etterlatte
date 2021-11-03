package soeknad

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import io.kotest.matchers.equality.shouldBeEqualToComparingFields
import no.nav.etterlatte.libs.common.soeknad.Soeknad
import org.junit.jupiter.api.Assertions.assertEquals
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
    fun `Skal mappe oppsummeringen korrekt`() {
        val oppsummering = soeknad.oppsummering

        assertEquals(5, oppsummering.size)

        val omDeg = oppsummering[0]
        assertEquals("Om deg", omDeg.tittel)
        assertEquals(2, omDeg.elementer.size)

        val omDegOgAvdoede = oppsummering[1]
        assertEquals("Om deg og avdøde", omDegOgAvdoede.tittel)
        assertEquals(1, omDegOgAvdoede.elementer.size)

        val omDenAvdoede = oppsummering[2]
        assertEquals("Om avdøde", omDenAvdoede.tittel)
        assertEquals(2, omDenAvdoede.elementer.size)

        val dinSituasjon = oppsummering[3]
        assertEquals("Situasjonen din", dinSituasjon.tittel)
        assertEquals(2, dinSituasjon.elementer.size)

        val omBarn = oppsummering[4]
        assertEquals("Om barn", omBarn.tittel)
        assertEquals(3, omBarn.elementer.size)
    }
}
