package no.nav.etterlatte

import kotlinx.coroutines.Job
import kotlinx.coroutines.delay

class TilstandsPusher(private val db: SoeknadRepository, private val publiserSoeknad: SoeknadPubliserer){
    suspend fun start(running: Job){
        delay(120_000)
        while(!running.isCompleted) {
            db.usendteSoeknader().forEach {
                publiserSoeknad.publiser(it)
            }
            delay(120_000)
        }
    }
}