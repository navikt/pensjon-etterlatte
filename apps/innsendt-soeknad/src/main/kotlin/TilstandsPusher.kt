package no.nav.etterlatte

import kotlinx.coroutines.Job
import kotlinx.coroutines.delay

class TilstandsPusher(private val db: SoeknadRepository, private val publiserSoeknad: SoeknadPubliserer){
    suspend fun start(running: Job){
        var cycle = Cycle(12, 0)
        while(!running.isCompleted) {
            cycle = cycle.step()

            if(cycle.currentStep == 0){
                db.usendteSoeknader().also {
                    println("Publiserer melding om søknader ${it.map(LagretSoeknad::id)} ut på kafka")
                }.forEach {
                    publiserSoeknad.publiser(it)
                }
            } else {
                delay(10_000)
            }
        }
    }
}