package no.nav.etterlatte.jobs

import soeknad.SoeknadRepository
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import no.nav.etterlatte.SoeknadPubliserer
import soeknad.LagretSoeknad
import org.slf4j.LoggerFactory

class TilstandsPusher(private val db: SoeknadRepository, private val publiserSoeknad: SoeknadPubliserer) {
    private val logger = LoggerFactory.getLogger(TilstandsPusher::class.java)

    suspend fun start(running: Job) {
        var cycle = Cycle(12, 0)
        while (!running.isCompleted) {
            cycle = cycle.step()

            if (cycle.currentStep == 0 && LeaderElection.isLeader()) {
                try {
                    db.slettArkiverteSoeknader()
                    db.slettUtgaatteKladder()
                    db.usendteSoeknader().also {
                        logger.info("Publiserer melding om søknader ${it.map(LagretSoeknad::id)} ut på kafka")
                    }.forEach {
                        publiserSoeknad.publiser(it)
                    }
                } catch (e: Exception) {
                    logger.error("Feil under kjøring av jobb: ", e)
                }
            } else {
                delay(60_000) // 1 min
            }
        }
    }
}
