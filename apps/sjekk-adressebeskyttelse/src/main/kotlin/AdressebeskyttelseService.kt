package no.nav.etterlatte

import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadType
import no.nav.etterlatte.libs.common.pdl.AdressebeskyttelsePerson
import no.nav.etterlatte.libs.common.pdl.Gradering
import no.nav.etterlatte.libs.common.pdl.Pdl
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import org.slf4j.LoggerFactory

class AdressebeskyttelseService(private val klient: Pdl) {
    private val logger = LoggerFactory.getLogger(AdressebeskyttelseService::class.java)

    /**
     * Henter ut adressebeskyttelse-gradering basert liste over identer/fnr.
     *
     * @param fnrListe: Liste over fødselsnummere
     *
     * @return Gyldig gradering av PDL-typen [Gradering].
     *  Gir verdi [Gradering.UGRADERT] dersom ingenting er funnet.
     */
    suspend fun hentGradering(fnrListe: List<Foedselsnummer>, type: SoeknadType): Gradering {
        val personer = klient.finnAdressebeskyttelseForFnr(fnrListe, type).data?.hentPersonBolk?.mapNotNull { it.person }

        if (personer.isNullOrEmpty()) {
            throw Exception("Fant ingen personer i PDL")
        }

        return hentPrioritertGradering(personer)
            .also { logger.info("Gradering vurdert til $it") }
    }

    /**
     * Henter ut alle graderinger fra liste over personer og deretter henter prioritert [Gradering]
     *
     * @return [Gradering]
     */
    private fun hentPrioritertGradering(personer: List<AdressebeskyttelsePerson>): Gradering =
        personer.flatMap { it.adressebeskyttelse }
            .mapNotNull { it.gradering }
            .minOrNull() ?: Gradering.UGRADERT
}
