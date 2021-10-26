import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import io.kotest.matchers.collections.shouldContainExactlyInAnyOrder
import no.nav.etterlatte.Soeker
import no.nav.etterlatte.Soeknad
import no.nav.etterlatte.finnSoekere
import no.nav.etterlatte.libs.common.soeknad.SoeknadType
import org.junit.jupiter.api.Test

internal class SoknadModelKtTest {
    private val mapper = jacksonObjectMapper()

    @Test
    fun `Skal hente ut alle personer som skal ha en egen søknad`() {
        val soeknad: Soeknad =
            mapper.readValue(javaClass.getResource("/soeknad_med_barnepensjon.json")!!.readText())

        val soekere = soeknad.finnSoekere(gjenlevendeFnr = "12345678100")

        soekere shouldContainExactlyInAnyOrder listOf(
            Soeker("12345678100", SoeknadType.Gjenlevendepensjon),
            Soeker("08021376974", SoeknadType.Barnepensjon)
        )
    }

    @Test
    fun `Skal håndtere søknad med barn uten søknad om barnepensjon`() {
        val soeknad: Soeknad =
            mapper.readValue(javaClass.getResource("/soeknad_med_barn_uten_barnepensjon.json")!!.readText())

        val soekere = soeknad.finnSoekere(gjenlevendeFnr = "12345678100")

        soekere shouldContainExactlyInAnyOrder listOf(
            Soeker("12345678100", SoeknadType.Gjenlevendepensjon)
        )
    }

    @Test
    fun `Skal håndtere søknad uten barn`() {
        val soeknad: Soeknad = mapper.readValue(javaClass.getResource("/soeknad_uten_barn.json")!!.readText())

        val soekere = soeknad.finnSoekere(gjenlevendeFnr = "12345678100")

        soekere shouldContainExactlyInAnyOrder listOf(
            Soeker("12345678100", SoeknadType.Gjenlevendepensjon)
        )
    }
}
