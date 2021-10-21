import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import io.kotest.matchers.collections.shouldContainExactly
import io.kotest.matchers.shouldBe
import no.nav.etterlatte.FnrHelper
import org.junit.jupiter.api.Test

internal class FnrHelperTest {

    @Test
    fun `Skal finne alle gyldige fnr i soknaden`() {
        val soeknadEksempelJson = javaClass.getResource("/FinnFnrSoeknadTest1.json")!!.readText()
        val soeknadEksempel = jacksonObjectMapper().readTree(soeknadEksempelJson)

        val gyldigeFoedselsnummer = listOf(
            "07106123912", "14106126780", "21929774873", "24014021406", "61929750062", "61483601467", "29507030252"
        )

        val resultat = FnrHelper.finnAlleFnr(soeknadEksempel)

        resultat.size shouldBe 7
        resultat shouldContainExactly gyldigeFoedselsnummer
    }

}
