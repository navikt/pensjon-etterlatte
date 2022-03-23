package no.nav.etterlatte.jobs

import io.prometheus.client.Gauge
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import org.slf4j.LoggerFactory
import soeknad.StatistikkRepository
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit

class TilstandsProbe(private val db: StatistikkRepository){
    private val usendtAlder = Gauge.build("alder_eldste_usendte", "Alder på elste usendte søknad").register()
    private val ikkeJournalfoertAlder = Gauge.build("alder_eldste_uarkiverte", "Alder på eldste ikke-arkiverte søknad").register()
    private val soknadTilstand = Gauge.build("soknad_tilstand", "Tilstanden søknader er i").labelNames("tilstand").register()
    private val soknadKilde = Gauge.build("soknad_kilde", "Antall søknader fra ulik kilde").labelNames("kilde").register()

    private val logger = LoggerFactory.getLogger(TilstandsProbe::class.java)

    internal fun gatherMetrics(){
        db.eldsteUsendte()?.apply {
            usendtAlder.set(ChronoUnit.MINUTES.between(this, LocalDateTime.now()).toDouble())
        }
        db.eldsteUarkiverte()?.apply {
            ikkeJournalfoertAlder.set(ChronoUnit.MINUTES.between(this, LocalDateTime.now()).toDouble())
        }

        db.rapport()
            .also { rapport -> logger.info(rapport.toString()) }
            .forEach { (status, antall) -> soknadTilstand.labels(status.name).set(antall.toDouble()) }

        db.kildeCount()
            .also { kilde -> logger.info(kilde.toString()) }
            .forEach { (kilde, antall) -> soknadKilde.labels(kilde.name).set(antall.toDouble())}

        logger.info("Ukategoriserte søknader: " + db.ukategorisert().toString())
    }

    suspend fun start(running: Job){
        var cycle = Cycle(6, 0)
        while(!running.isCompleted) {
            cycle = cycle.step()
            if(cycle.currentStep == 0){
                try {
                    gatherMetrics()
                } catch (e: Exception) {
                    logger.error("Feil oppsto under oppretting av rapport/metrikker: ", e)
                }
            } else {
                delay(10_000)
            }
        }
    }
}
