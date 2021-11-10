package soeknad

import org.junit.jupiter.api.Test

class SoeknadFixturesTest {

    @Test
    fun `Skal laste søknad fixtures`() {
        SoeknadFixtures.soeknadUtenBarn
        SoeknadFixtures.soeknadMedBarnepensjon
        SoeknadFixtures.soeknadMedBarnUtenBarnepensjon
    }
}
