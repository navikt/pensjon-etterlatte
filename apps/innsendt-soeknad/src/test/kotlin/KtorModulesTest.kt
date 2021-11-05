import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.kotest.matchers.collections.shouldContainExactly
import no.nav.etterlatte.Soeker
import no.nav.etterlatte.finnSoekere
import no.nav.etterlatte.libs.common.soeknad.SoeknadType
import org.junit.jupiter.api.Test
import soeknad.SoeknadFixtures

internal class KtorModulesTest {
    private val mapper = jacksonObjectMapper()

    @Test
    fun `Skal hente ut alle personer som skal ha en egen søknad`() {
        val soekere = finnSoekere(SoeknadFixtures.soeknadMedBarnepensjon, gjenlevendeFnr = "12345678100")

        soekere shouldContainExactly listOf(
            Soeker("12345678100", SoeknadType.Gjenlevendepensjon),
            Soeker("12345678911", SoeknadType.Barnepensjon)
        )
    }

    @Test
    fun `Skal håndtere søknad med barn uten søknad om barnepensjon`() {
        val soekere = finnSoekere(SoeknadFixtures.soeknadMedBarnUtenBarnepensjon, gjenlevendeFnr = "12345678100")

        soekere shouldContainExactly listOf(
            Soeker("12345678100", SoeknadType.Gjenlevendepensjon)
        )
    }

    @Test
    fun `Skal håndtere søknad uten barn`() {
        val soekere = finnSoekere(SoeknadFixtures.soeknadUtenBarn, gjenlevendeFnr = "12345678100")

        soekere shouldContainExactly listOf(
            Soeker("12345678100", SoeknadType.Gjenlevendepensjon)
        )
    }
}
