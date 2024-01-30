package dokarkiv

import io.kotest.matchers.shouldBe
import no.nav.etterlatte.dokarkiv.JournalpostHelper.opprettTittel
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadType
import org.junit.jupiter.api.Test

class JournalpostHelperTest {

    @Test
    fun `Tittel opprettes riktig`() {
        opprettTittel(SoeknadType.BARNEPENSJON) shouldBe "Søknad om barnepensjon"
        opprettTittel(SoeknadType.OMSTILLINGSSTOENAD) shouldBe "Søknad om omstillingsstønad"
        opprettTittel(SoeknadType.GJENLEVENDEPENSJON) shouldBe "Søknad om gjenlevendepensjon"
    }
}