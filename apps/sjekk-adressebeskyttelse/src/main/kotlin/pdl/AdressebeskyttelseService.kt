package no.nav.etterlatte.pdl

import no.nav.etterlatte.libs.common.pdl.AdressebeskyttelsePerson
import no.nav.etterlatte.libs.common.pdl.Gradering
import org.slf4j.LoggerFactory

class AdressebeskyttelseService(private val klient: Pdl) {
    private val logger = LoggerFactory.getLogger(AdressebeskyttelseService::class.java)

    /**
     * Henter ut adressebeskyttelse-gradering basert liste over identer/fnr.
     *
     * @param fnr: Liste over fødselsnummere
     *
     * @return Gyldig gradering av PDL-typen [Gradering].
     *  Gir verdi [Gradering.UGRADERT] dersom ingenting er funnet.
     */
    suspend fun hentGradering(fnr: List<String>): Gradering {
        val personListe = klient.finnAdressebeskyttelseForFnr(fnr).data
            ?.hentPersonBolk
            ?.mapNotNull { it.person }

        // TODO: Avklare hvordan vi skal løse problemet dersom ingen personer blir funnet i PDL...
        if (personListe.isNullOrEmpty())
            throw Exception("Fant ingen personer i PDL med fnr: $fnr")

        return hentPrioritertGradering(personListe)
            .also { logger.info("Fant $it i liste over fnr: $fnr") }
    }

    /**
     * Henter ut alle graderinger fra liste over personer og deretter henter prioritert [Gradering]
     *
     * @return [Gradering]
     */
    private fun hentPrioritertGradering(personer: List<AdressebeskyttelsePerson>): Gradering =
        personer.flatMap { it.adressebeskyttelse }
            .mapNotNull { it.gradering }
            .minOrNull()
            ?: Gradering.UGRADERT
}
