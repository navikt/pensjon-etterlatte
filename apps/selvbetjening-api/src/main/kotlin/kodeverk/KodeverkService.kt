package no.nav.etterlatte.kodeverk

import org.slf4j.LoggerFactory
import java.time.LocalDate

class KodeverkService(private val klient: Kodeverk) {
    private val logger = LoggerFactory.getLogger(KodeverkService::class.java)

    suspend fun hentPoststed(postnr: String?): String? {
        if (postnr.isNullOrBlank()) return null

        logger.info("Henter poststed for postnummer $postnr")

        // Todo: cache postnummerliste?
        return klient.hentPoststed(postnr).hentTekst(postnr, "nb")
    }

    suspend fun hentLand(landkode: String?): String {
        if (landkode.isNullOrBlank()) return ""

        return klient.hentLandkoder().hentTekst(landkode, "nb")
    }

    private fun KodeverkResponse.hentTekst(kode: String, locale: String): String {
        val gyldigBetydning = this.betydninger[kode]
            ?.find { it -> it.gyldigTil > LocalDate.now().toString() }

        return gyldigBetydning?.beskrivelser
            ?.get(locale)
            ?.tekst
            ?.capitalize()
            .orEmpty()
    }

    private fun String.capitalize() = lowercase().replaceFirstChar { it.uppercase() }
}
