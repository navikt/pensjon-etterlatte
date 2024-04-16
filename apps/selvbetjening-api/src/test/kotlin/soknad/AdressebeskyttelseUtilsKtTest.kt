package soknad

import io.kotest.matchers.collections.shouldContainExactlyInAnyOrder
import io.kotest.matchers.shouldBe
import no.nav.etterlatte.libs.common.innsendtsoeknad.barnepensjon.Barnepensjon
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadRequest
import no.nav.etterlatte.libs.common.innsendtsoeknad.omstillingsstoenad.Omstillingsstoenad
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import no.nav.etterlatte.libs.utils.test.InnsendtSoeknadFixtures
import no.nav.etterlatte.libs.utils.test.eksempelBarn
import no.nav.etterlatte.soknad.finnUnikeBarn
import no.nav.etterlatte.soknad.fjernStedslokaliserendeInfo
import org.junit.jupiter.api.Test

internal class AdressebeskyttelseUtilsKtTest {

    @Test
    fun `Skal finne unike barn`() {
        val omstillingsstoenad = InnsendtSoeknadFixtures.omstillingsSoeknad(
            innsenderFnr = Foedselsnummer.of("24014021406"),
            barn = listOf(
                eksempelBarn(Foedselsnummer.of("29080775995")),
                eksempelBarn(Foedselsnummer.of("03081375711")),
            )
        )
        val barnepensjon = InnsendtSoeknadFixtures.barnepensjon(
            innsenderFnr = Foedselsnummer.of("24014021406"),
            soekerFnr = Foedselsnummer.of("29080775995")
        )

        val request = SoeknadRequest((listOf(omstillingsstoenad, barnepensjon)))

        request.finnUnikeBarn() shouldContainExactlyInAnyOrder listOf(
            Foedselsnummer.of("03081375711"),
            Foedselsnummer.of("29080775995")
        )
    }

    @Test
    fun `Skal fjerne informasjon om utenlandsopphold og utbetalingsinformasjon for en gitt liste med barn`() {
        val omstillingsstoenad = InnsendtSoeknadFixtures.omstillingsSoeknad(
            innsenderFnr = Foedselsnummer.of("24014021406")
        )
        val barnepensjon = InnsendtSoeknadFixtures.barnepensjon(
            innsenderFnr = Foedselsnummer.of("24014021406"),
            soekerFnr = Foedselsnummer.of("29080775995")
        )

        val request = SoeknadRequest((listOf(omstillingsstoenad, barnepensjon)))
        val barnFnr = listOf(Foedselsnummer.of("29080775995"), Foedselsnummer.of("24014021406"))

        val updatedRequest = request.fjernStedslokaliserendeInfo(barnFnr)

        updatedRequest.soeknader.forEach { soeknad ->
            when (soeknad) {
                is Omstillingsstoenad -> {
                    soeknad.barn.map { it.utenlandsAdresse shouldBe null }
                }
                is Barnepensjon -> {
                    (soeknad.soesken + soeknad.soeker).map { it.utenlandsAdresse shouldBe null }
                    soeknad.utbetalingsInformasjon shouldBe null
                }
            }
        }
    }
}
