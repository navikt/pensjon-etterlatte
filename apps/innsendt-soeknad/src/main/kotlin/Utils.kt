package no.nav.etterlatte

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper

val mapper: ObjectMapper = jacksonObjectMapper()
fun Any.toJson(): String = mapper.writeValueAsString(this)

class Cycle(private val steps: Int, val currentStep: Int){
    fun step() = Cycle(steps, (currentStep + 1) % steps)
}
