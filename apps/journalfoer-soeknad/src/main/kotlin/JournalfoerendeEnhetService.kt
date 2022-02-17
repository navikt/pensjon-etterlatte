package no.nav.etterlatte

import no.nav.etterlatte.libs.common.innsendtsoeknad.OppholdUtlandType
import no.nav.etterlatte.libs.common.innsendtsoeknad.Utenlandsopphold
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

/**
 * Dersom en avdød har bodd eller arbeidet i avtaleland/EØS/EU skal saken eksplisitt rutes til egen enhet.
 */
private fun finnEnhet(soeknad: InnsendtSoeknad): String? {
    val utenlandsoppholdIAvtaleland: Boolean = when (soeknad) {
        is Gjenlevendepensjon -> {
            soeknad.avdoed.utenlandsopphold.opplysning?.harUtenlandsoppholdIAvtaleland() ?: false
        }
        is Barnepensjon -> {
            val avdoede = soeknad.foreldre.filterIsInstance<Avdoed>()
            avdoede.any { it.utenlandsopphold.opplysning?.harUtenlandsoppholdIAvtaleland() ?: false }
        }
        else -> throw Exception("Ukjent søknadstype")
    }

    return if (utenlandsoppholdIAvtaleland) Konstanter.ENHET_UTLAND else null
}

private fun List<Utenlandsopphold>.harUtenlandsoppholdIAvtaleland(): Boolean =
    this.any { opphold ->
        opphold.oppholdsType.svar.map { type -> type.verdi }.contains(OppholdUtlandType.ARBEIDET) &&
                opphold.land.svar.innhold in Konstanter.avtaleland
    }
