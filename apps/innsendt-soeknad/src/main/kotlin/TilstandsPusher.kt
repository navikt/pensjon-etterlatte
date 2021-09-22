package no.nav.etterlatte

import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import org.slf4j.LoggerFactory

class TilstandsPusher(private val db: SoeknadRepository, private val publiserSoeknad: SoeknadPubliserer){
    private val logger = LoggerFactory.getLogger(TilstandsPusher::class.java)

    suspend fun start(running: Job){
        var cycle = Cycle(12, 0)
        while(!running.isCompleted) {
            cycle = cycle.step()

            if(cycle.currentStep == 0 && LeaderElection.isLeader()){
                db.slettArkiverteSoeknader()
                db.usendteSoeknader().also {
                    logger.info("Publiserer melding om søknader ${it.map(LagretSoeknad::id)} ut på kafka")
                }.forEach {
                    publiserSoeknad.publiser(it)
                }
            } else {
                delay(10_000)
            }
        }
    }
}
