package no.nav.etterlatte

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import no.nav.etterlatte.libs.common.soeknad.SoeknadType

val mapper: ObjectMapper = jacksonObjectMapper()
fun Any.toJson(): String = mapper.writeValueAsString(this)

class Cycle(private val steps: Int, val currentStep: Int) {
    fun step() = Cycle(steps, (currentStep + 1) % steps)
}

fun finnSoekere(soeknad: Soeknad, gjenlevende: String): List<Soeker> {
    val barn: List<Element>? = soeknad.oppsummering.find { it.tittel == "Om barn" }
        ?.elementer
        ?.filter { it.tittel != null }

    val barnepensjonFnr: List<String> = barn?.map { it.innhold }?.filter {
        it.any {
            it.key == "omBarn.barnepensjon.soeker" && it.svar == "Ja"
        }
    }?.map { it.find { it.key == "omBarn.foedselsnummer" }?.svar.toString() } ?: emptyList()

    val barnepensjonSoeknader = barnepensjonFnr.map { Soeker(it, SoeknadType.Barnepensjon) }

    return barnepensjonSoeknader.plus(Soeker(gjenlevende, SoeknadType.Gjenlevendepensjon))
}


