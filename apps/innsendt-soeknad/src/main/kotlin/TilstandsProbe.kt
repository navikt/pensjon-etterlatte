package no.nav.etterlatte

import io.prometheus.client.Gauge
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit

class TilstandsProbe(private val db: PostgresSoeknadRepository){
    private val usendtAlder = Gauge.build("alder_eldste_usendte", "Alder på elste usendte søknad").register()
    private val ikkeJournalfoertAlder = Gauge.build("alder_eldste_uarkiverte", "Alder på eldste ikke-arkiverte søknad").register()
    private val soknadTilstand = Gauge.build("soknad_tilstand", "Tilstanden søknader er i").labelNames("tilstand").register()

    suspend fun start(running: Job){
        delay(60_000)
        while(!running.isCompleted) {
            db.eldsteUsendte()?.apply {
                usendtAlder.set(ChronoUnit.MINUTES.between(this, LocalDateTime.now()).toDouble())
            }
            db.eldsteUarkiverte()?.apply {
                ikkeJournalfoertAlder.set(ChronoUnit.MINUTES.between(this, LocalDateTime.now()).toDouble())
            }

            db.rapport().also{
                println(it)
            }.forEach{
                soknadTilstand.labels(it.key).set(it.value.toDouble())
            }
            delay(60_000)
        }
    }
}