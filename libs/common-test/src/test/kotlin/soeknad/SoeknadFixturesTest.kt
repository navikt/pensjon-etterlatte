package soeknad

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import org.junit.jupiter.api.Test

class SoeknadFixturesTest {

    @Test
    fun `Skal laste innsendt søknad fixtures`() {
        InnsendtSoeknadFixtures.gjenlevendepensjon()
        InnsendtSoeknadFixtures.barnepensjon()
    }
}
