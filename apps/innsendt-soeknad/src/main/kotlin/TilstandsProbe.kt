package no.nav.etterlatte


import io.prometheus.client.Gauge
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import org.slf4j.LoggerFactory
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit

class TilstandsProbe(private val db: StatistikkRepository){
    private val usendtAlder = Gauge.build("alder_eldste_usendte", "Alder på elste usendte søknad").register()
    private val ikkeJournalfoertAlder = Gauge.build("alder_eldste_uarkiverte", "Alder på eldste ikke-arkiverte søknad").register()
    private val soknadTilstand = Gauge.build("soknad_tilstand", "Tilstanden søknader er i").labelNames("tilstand").register()
    val logger = LoggerFactory.getLogger("no.pensjon.etterlatte")
    private fun gatherMetrics(){
        db.eldsteUsendte()?.apply {
            usendtAlder.set(ChronoUnit.MINUTES.between(this, LocalDateTime.now()).toDouble())
        }
        db.eldsteUarkiverte()?.apply {
            ikkeJournalfoertAlder.set(ChronoUnit.MINUTES.between(this, LocalDateTime.now()).toDouble())
        }

        db.rapport().also{
            logger.info(it.toString())
        }.forEach{
            soknadTilstand.labels(it.key).set(it.value.toDouble())
        }
    }

    suspend fun start(running: Job){
        var cycle = Cycle(6, 0)
        while(!running.isCompleted) {
            cycle = cycle.step()
            if(cycle.currentStep == 0){
                gatherMetrics()
            } else {
                delay(10_000)
            }


        }
    }
}