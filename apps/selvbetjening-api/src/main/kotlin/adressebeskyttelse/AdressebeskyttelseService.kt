package no.nav.etterlatte.adressebeskyttelse

import no.nav.etterlatte.libs.common.pdl.AdressebeskyttelseBolkPerson
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
     * @return Gyldig graderinger av PDL-typen [Gradering].
     *  Gir verdi [Gradering.UGRADERT] dersom ingenting er funnet.
     */
    suspend fun hentGradering(fnrListe: List<Foedselsnummer>): Map<String, Gradering> {
        if (fnrListe.isEmpty()) return emptyMap()

        val personer = klient.finnAdressebeskyttelseForFnr(fnrListe).data?.hentPersonBolk
            ?: throw Exception("Fant ingen personer i PDL")

        if (personer.size != fnrListe.size) {
            logger.info("Fant ikke alle personene i PDL")
        }

        return hentPrioritertGradering(personer)
    }

    /**
     * Henter ut alle graderinger fra liste over personer
     *
     * @return Map<[String], [Gradering]>
     */
    private fun hentPrioritertGradering(personer: List<AdressebeskyttelseBolkPerson>): Map<String, Gradering> =
        personer.associate { it.ident to (it.person?.finnGradering() ?: Gradering.UGRADERT) }

    private fun AdressebeskyttelsePerson.finnGradering(): Gradering? =
        this.adressebeskyttelse
            .mapNotNull { it.gradering }
            .minOrNull()
}
