package soeknad

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import no.nav.etterlatte.libs.common.soeknad.Soeknad
import org.junit.jupiter.api.Test

class SoeknadTest {
    private val mapper = jacksonObjectMapper()

    @Test
    fun `Skal stemme overens med json-struktur`() {
        mapper.readValue<Soeknad>(javaClass.getResource("/mock-soeknad.json")!!.readText())
    }
}
