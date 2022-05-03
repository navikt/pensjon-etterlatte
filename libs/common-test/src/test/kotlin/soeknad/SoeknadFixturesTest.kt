package soeknad

import org.junit.jupiter.api.Test

class SoeknadFixturesTest {

    @Test
    fun `Skal laste innsendt søknad fixtures`() {
        InnsendtSoeknadFixtures.gjenlevendepensjon()
        InnsendtSoeknadFixtures.barnepensjon()
    }
}
