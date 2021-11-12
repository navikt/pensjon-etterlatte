package no.nav.etterlatte.soeknad

import no.nav.etterlatte.libs.common.soeknad.Soeknad
import no.nav.etterlatte.libs.common.soeknad.SoeknadType
import no.nav.etterlatte.libs.common.soeknad.Valg
import soeknad.Soeker


fun finnSoekere(soeknad: Soeknad, gjenlevendeFnr: String): List<Soeker> {
    val gjenlevende = Soeker(gjenlevendeFnr, SoeknadType.Gjenlevendepensjon)
    val barnepensjon: List<Soeker> = soeknad.utfyltSoeknad.opplysningerOmBarn.barn
        .filter { it.barnepensjon?.soeker == Valg.JA }
        .map { Soeker(it.foedselsnummer, SoeknadType.Barnepensjon) }

    return listOf(gjenlevende) + barnepensjon
}
