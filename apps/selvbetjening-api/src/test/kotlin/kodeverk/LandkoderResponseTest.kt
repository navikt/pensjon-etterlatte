package kodeverk

import no.nav.etterlatte.common.mapJsonToAny
import no.nav.etterlatte.common.toJson
import no.nav.etterlatte.kodeverk.KodeverkResponse
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test

internal class LandkoderResponseTest {


    @Test
    fun serde() {
        val json = javaClass.getResource("/kodeverk/landkoder.json")!!.readText()

        val landkoder = mapJsonToAny<KodeverkResponse>(json)

        println(landkoder)
    }
}