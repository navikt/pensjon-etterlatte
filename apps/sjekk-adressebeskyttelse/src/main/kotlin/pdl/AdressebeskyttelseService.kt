package no.nav.etterlatte.pdl

import no.nav.etterlatte.libs.common.pdl.AdressebeskyttelsePerson
import no.nav.etterlatte.libs.common.pdl.Gradering
import no.nav.etterlatte.libs.common.person.Foedselsnummer
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
    suspend fun hentGradering(fnr: Foedselsnummer): Gradering {
        val person = klient.finnAdressebeskyttelseForFnr(fnr).data?.hentPerson
            ?: throw Exception("Fant ikke person i PDL!")

        return hentPrioritertGradering(person)
            .also { logger.info("Fant gradering $it på person i PDL.") }
    }

    /**
     * Henter ut alle graderinger fra liste over personer og deretter henter prioritert [Gradering]
     *
     * @return [Gradering]
     */
    private fun hentPrioritertGradering(person: AdressebeskyttelsePerson): Gradering =
        person.adressebeskyttelse
            .mapNotNull { it.gradering }
            .minOrNull()
            ?: Gradering.UGRADERT
}
