package no.nav.etterlatte.kodeverk

import com.github.benmanes.caffeine.cache.Caffeine
import no.nav.etterlatte.kodeverk.CacheKey.LANDKODER
import no.nav.etterlatte.kodeverk.CacheKey.POSTSTEDER
import no.nav.etterlatte.kodeverk.CacheKey.VALUTAER
import org.slf4j.LoggerFactory
import java.time.LocalDate
import java.util.concurrent.TimeUnit

class KodeverkService(private val klient: Kodeverk) {
    private val logger = LoggerFactory.getLogger(KodeverkService::class.java)

    private val cache = Caffeine.newBuilder()
        .expireAfterWrite(1, TimeUnit.HOURS)
        .build<CacheKey, KodeverkResponse>()

    suspend fun hentPoststed(postnr: String?, spraak: String = "nb"): String? {
        if (postnr.isNullOrBlank()) return null

        logger.info("Henter poststed for postnummer $postnr")

        val poststeder = cache.getIfPresent(POSTSTEDER)
            ?: klient.hentPostnummer().also { cache.put(POSTSTEDER, it) }

        return poststeder.hentTekst(postnr, spraak)
    }

    suspend fun hentAlleLand(): List<Betydning> {
        val landkoder = cache.getIfPresent(LANDKODER)
            ?: klient.hentLandkoder().also { cache.put(LANDKODER, it) }

        return landkoder
            .betydninger
            .flatMap { (_, betydninger) -> betydninger }
    }

    suspend fun hentLand(landkode: String?, spraak: String = "nb"): String? {
        if (landkode.isNullOrBlank()) return null

        logger.info("Henter land for landkode $landkode")

        val landkoder = cache.getIfPresent(LANDKODER)
            ?: klient.hentLandkoder().also { cache.put(LANDKODER, it) }

        return landkoder.hentTekst(landkode, spraak)
    }

    suspend fun hentValutaer(): List<Valuta> {
        val valutaer = cache.getIfPresent(VALUTAER)
            ?: klient.hentValutaer().also { cache.put(VALUTAER, it) }

        return valutaer
            .betydninger
            .flatMap { (isoKode, betydninger) ->
                betydninger.map {
                    BetydningMedIsoKode(
                        gyldigFra = it.gyldigFra,
                        gyldigTil = it.gyldigTil,
                        beskrivelser = it.beskrivelser,
                        isoKode = isoKode,
                    )
                }
            }
            .mapNotNull { betydningMedIsoKode ->
                betydningMedIsoKode.beskrivelser["nb"]?.let { beskrivelse ->
                    Valuta(
                        isoKode = betydningMedIsoKode.isoKode,
                        gyldigFra = betydningMedIsoKode.gyldigFra,
                        gyldigTil = betydningMedIsoKode.gyldigTil,
                        beskrivelse = beskrivelse,
                    )
                }
            }
    }

    private fun KodeverkResponse.hentTekst(kode: String, spraak: String): String {
        val gyldigBetydning = this.betydninger[kode]
            ?.find { it -> it.gyldigTil > LocalDate.now().toString() }

        return gyldigBetydning?.beskrivelser
            ?.get(spraak)
            ?.tekst
            ?.capitalize()
            .orEmpty()
    }

    private fun String.capitalize() = lowercase().replaceFirstChar { it.uppercase() }
}

private enum class CacheKey {
    LANDKODER,
    POSTSTEDER,
    VALUTAER
}
