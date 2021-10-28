package no.nav.etterlatte

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper

val mapper: ObjectMapper = jacksonObjectMapper()

<<<<<<< HEAD:apps/innsendt-soeknad/src/main/kotlin/Utils.kt
class Cycle(private val steps: Int, val currentStep: Int) {
    fun step() = Cycle(steps, (currentStep + 1) % steps)
}
=======
fun Any.toJson(): String = mapper.writeValueAsString(this)
>>>>>>> 44393d39 (Oppdatere pakkestruktur og tester):apps/innsendt-soeknad/src/main/kotlin/JsonUtils.kt
