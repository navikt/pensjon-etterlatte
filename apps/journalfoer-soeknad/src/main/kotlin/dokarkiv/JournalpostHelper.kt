package no.nav.etterlatte.dokarkiv

import no.nav.etterlatte.libs.common.innsendtsoeknad.common.SoeknadType

object JournalpostHelper {
    fun opprettTittel(soeknadType: SoeknadType): String =
        when (soeknadType) {
            SoeknadType.BARNEPENSJON -> "Søknad om barnepensjon"
            SoeknadType.OMSTILLINGSSTOENAD -> "Søknad om omstillingsstønad"
        }
}