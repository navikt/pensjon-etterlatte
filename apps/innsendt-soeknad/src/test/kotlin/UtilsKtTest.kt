import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonTypeRef
import io.kotest.matchers.collections.shouldContainExactlyInAnyOrder
import no.nav.etterlatte.Soeknad
import no.nav.etterlatte.Soeker
import no.nav.etterlatte.finnSoekere
import no.nav.etterlatte.libs.common.soeknad.SoeknadType
import org.junit.jupiter.api.Test

internal class UtilsKtTest {
    private val mapper = jacksonObjectMapper()

    @Test
    fun `Skal hente ut alle personer som skal ha en egen søknad`() {
        val soeknad: Soeknad = mapper.readValue(javaClass.getResource("/soeknad_med_barnepensjon.json")!!.readText(), jacksonTypeRef<Soeknad>())

        val soekere = finnSoekere(soeknad, "12345678100")

        soekere shouldContainExactlyInAnyOrder listOf(
            Soeker("12345678100", SoeknadType.Gjenlevendepensjon),
            Soeker("08021376974", SoeknadType.Barnepensjon)
        )
    }
}
