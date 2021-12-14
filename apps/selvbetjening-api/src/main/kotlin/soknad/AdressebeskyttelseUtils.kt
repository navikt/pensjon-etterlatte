package no.nav.etterlatte.soknad

import no.nav.etterlatte.libs.common.innsendtsoeknad.barnepensjon.Barnepensjon
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Barn
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadRequest
import no.nav.etterlatte.libs.common.innsendtsoeknad.gjenlevendepensjon.Gjenlevendepensjon
import no.nav.etterlatte.libs.common.person.Foedselsnummer


internal fun SoeknadRequest.finnUnikeBarn() = this.soeknader.flatMap {
    when (it) {
        is Gjenlevendepensjon -> it.barn
        is Barnepensjon -> it.soesken + it.soeker
        else -> throw Exception("Ukjent søknadstype")
    }
}.map { it.foedselsnummer }.distinct()

/**
 * Funksjonen fjerner informasjon om utenlandsadresse for barn med adressesperre.
 */
internal fun SoeknadRequest.fjernUtenlandsadresseFor(fnrListe: List<Foedselsnummer>): SoeknadRequest = this.copy(
    soeknader = this.soeknader.map { soeknad ->
        when (soeknad) {
            is Gjenlevendepensjon -> soeknad.copy(
                barn = soeknad.barn.map { it.utenAdresseFor(fnrListe) }
            )
            is Barnepensjon -> soeknad.copy(
                soeker = soeknad.soeker.utenAdresseFor(fnrListe),
                soesken = soeknad.soesken.map { it.utenAdresseFor(fnrListe) }
            )
            else -> throw Exception("Ukjent søknadstype")
        }
    }
)

private fun Barn.utenAdresseFor(fnrListe: List<Foedselsnummer>) =
    if (this.foedselsnummer in fnrListe) this.copy(utenlandsAdresse = null) else this
