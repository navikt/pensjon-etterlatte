package soeknad

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import no.nav.etterlatte.libs.common.soeknad.Soeknad

class SoeknadFixtures {
    companion object {
        private val mapper = jacksonObjectMapper()
        private fun readFile(path: String) = mapper.readValue<Soeknad>(javaClass.getResource(path)!!.readText())

        val soeknadMedBarnepensjon: Soeknad = readFile("/soeknad_med_barnepensjon.json")
        val soeknadUtenBarn: Soeknad = readFile("/soeknad_uten_barn.json")
        val soeknadMedBarnUtenBarnepensjon: Soeknad = readFile("/soeknad_med_barn_uten_barnepensjon.json")
    }
}
