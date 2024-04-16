package no.nav.etterlatte.soknad

import no.nav.etterlatte.libs.common.innsendtsoeknad.barnepensjon.Barnepensjon
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Barn
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadRequest
import no.nav.etterlatte.libs.common.innsendtsoeknad.omstillingsstoenad.Omstillingsstoenad
import no.nav.etterlatte.libs.common.person.Foedselsnummer


internal fun SoeknadRequest.finnUnikeBarn() = this.soeknader.flatMap {
    when (it) {
        is Omstillingsstoenad -> it.barn
        is Barnepensjon -> it.soesken + it.soeker
        else -> throw Exception("Ukjent søknadstype")
    }
}.map { it.foedselsnummer.svar }.distinct()

/**
 * Funksjonen fjerner informasjon om utenlandsadresse for barn med adressesperre.
 */
internal fun SoeknadRequest.fjernStedslokaliserendeInfo(fnrListe: List<Foedselsnummer>): SoeknadRequest = this.copy(
    soeknader = this.soeknader.map { soeknad ->
        when (soeknad) {
            is Omstillingsstoenad -> soeknad.copy(
                barn = soeknad.barn.map { it.utenAdresseFor(fnrListe) }
            )
            is Barnepensjon -> soeknad.copy(
                soeker = soeknad.soeker.utenAdresseFor(fnrListe),
                soesken = soeknad.soesken.map { it.utenAdresseFor(fnrListe) },
                utbetalingsInformasjon = if (soeknad.soeker.foedselsnummer.svar in fnrListe) null else soeknad.utbetalingsInformasjon
            )
            else -> throw Exception("Ukjent søknadstype")
        }
    }
)

private fun Barn.utenAdresseFor(fnrListe: List<Foedselsnummer>) =
    if (this.foedselsnummer.svar in fnrListe) this.copy(utenlandsAdresse = null) else this
