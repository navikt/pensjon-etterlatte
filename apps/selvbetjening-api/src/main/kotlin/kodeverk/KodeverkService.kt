package no.nav.etterlatte.kodeverk

import org.slf4j.LoggerFactory
import java.time.LocalDate

class KodeverkService(private val klient: Kodeverk) {
    private val logger = LoggerFactory.getLogger(KodeverkService::class.java)

    suspend fun hentPoststed(postnr: String?): String {
        if (postnr.isNullOrBlank()) return ""

        logger.info("Henter poststed for postnummer $postnr")

        // Todo: cache postnummerliste?
        val postnummere = klient.hentPoststed(postnr)

        val gjeldendePoststed = postnummere.betydninger[postnr]
            ?.find { it -> it.gyldigTil > LocalDate.now().toString() }

        return gjeldendePoststed?.beskrivelser?.get("nb")?.tekst.orEmpty()
    }
}
