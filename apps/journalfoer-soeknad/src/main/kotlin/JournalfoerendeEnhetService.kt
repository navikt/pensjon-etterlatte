package no.nav.etterlatte

import no.nav.etterlatte.libs.common.innsendtsoeknad.barnepensjon.Barnepensjon
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Avdoed
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.InnsendtSoeknad
import no.nav.etterlatte.libs.common.innsendtsoeknad.gjenlevendepensjon.Gjenlevendepensjon
import no.nav.etterlatte.libs.common.pdl.Gradering

fun finnJournalfoerendeEnhet(soeknad: InnsendtSoeknad, gradering: Gradering): String? =
    when (gradering) {
        Gradering.STRENGT_FORTROLIG_UTLAND,
        Gradering.STRENGT_FORTROLIG -> Konstanter.ENHET_VIKAFOSSEN
        Gradering.FORTROLIG,
        Gradering.UGRADERT -> finnEnhet(soeknad)
    }

private fun finnEnhet(soeknad: InnsendtSoeknad): String? {
    val avdoede: List<Avdoed> = when (soeknad) {
        is Gjenlevendepensjon -> listOf(soeknad.avdoed)
        is Barnepensjon -> soeknad.foreldre.filterIsInstance<Avdoed>()
        else -> throw Exception("Ukjent søknadstype")
    }

    return if (avdoede.harHattOppholdIAvtaleland()) Konstanter.ENHET_UTLAND else null
}

private fun List<Avdoed>.harHattOppholdIAvtaleland(): Boolean =
    this.mapNotNull { it.utenlandsopphold.opplysning }.flatten()
        .any { it.land.svar.innhold in Konstanter.avtaleland }
