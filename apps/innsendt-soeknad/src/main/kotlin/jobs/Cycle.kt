package no.nav.etterlatte.jobs

class Cycle(private val steps: Int, val currentStep: Int) {
    fun step() = Cycle(steps, (currentStep + 1) % steps)
}
