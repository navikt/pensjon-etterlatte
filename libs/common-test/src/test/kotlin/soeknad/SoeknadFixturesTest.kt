package soeknad

import no.nav.etterlatte.libs.utils.test.InnsendtSoeknadFixtures
import org.junit.jupiter.api.Test

class SoeknadFixturesTest {

    @Test
    fun `Skal laste innsendt soeknad fixtures`() {
        InnsendtSoeknadFixtures.barnepensjon()
        InnsendtSoeknadFixtures.omstillingsSoeknad()
    }
}
