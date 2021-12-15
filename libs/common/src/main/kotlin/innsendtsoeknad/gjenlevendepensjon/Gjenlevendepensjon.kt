package no.nav.etterlatte.libs.common.innsendtsoeknad.gjenlevendepensjon

import com.fasterxml.jackson.annotation.JsonIgnoreProperties
import no.nav.etterlatte.libs.common.innsendtsoeknad.AndreYtelser
import no.nav.etterlatte.libs.common.innsendtsoeknad.AnnenUtdanning
import no.nav.etterlatte.libs.common.innsendtsoeknad.ArbeidOgUtdanning
import no.nav.etterlatte.libs.common.innsendtsoeknad.BankkontoType
import no.nav.etterlatte.libs.common.innsendtsoeknad.ForholdTilAvdoede
import no.nav.etterlatte.libs.common.innsendtsoeknad.HoeyesteUtdanning
import no.nav.etterlatte.libs.common.innsendtsoeknad.Kontaktinfo
import no.nav.etterlatte.libs.common.innsendtsoeknad.OppholdUtland
import no.nav.etterlatte.libs.common.innsendtsoeknad.SivilstatusType
import no.nav.etterlatte.libs.common.innsendtsoeknad.UtbetalingsInformasjon
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Avdoed
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Barn
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.BetingetOpplysning
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.ImageTag
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Innsender
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.InnsendtSoeknad
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Opplysning
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Person
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.PersonType
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Samboer
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.Svar
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import innsendtsoeknad.common.SoeknadType
import java.time.LocalDateTime

@JsonIgnoreProperties(ignoreUnknown = true)
data class Gjenlevendepensjon(
    override val imageTag: ImageTag,
    override val innsender: Innsender,
    override val soeker: Gjenlevende,
    override val harSamtykket: Opplysning<Boolean>,
    override val utbetalingsInformasjon: BetingetOpplysning<BankkontoType, UtbetalingsInformasjon>?,

    val avdoed: Avdoed,
    val barn: List<Barn>
) : InnsendtSoeknad {
    override val versjon = "1"
    override val type: SoeknadType = SoeknadType.GJENLEVENDEPENSJON
    override val mottattDato: LocalDateTime = LocalDateTime.now()
}

data class Gjenlevende(
    override val fornavn: String,
    override val etternavn: String,
    override val foedselsnummer: Foedselsnummer,

    val statsborgerskap: String,
    val sivilstatus: String,
    val adresse: Opplysning<String>?,
    val bostedsAdresse: BetingetOpplysning<Svar, Opplysning<String>?>,
    val kontaktinfo: Kontaktinfo,
    val flyktning: Opplysning<Svar>?,
    val oppholdUtland: BetingetOpplysning<Svar, OppholdUtland?>,
    val nySivilstatus: BetingetOpplysning<SivilstatusType, Samboer?>,
    val arbeidOgUtdanning: ArbeidOgUtdanning?,
    val fullfoertUtdanning: BetingetOpplysning<HoeyesteUtdanning, Opplysning<AnnenUtdanning>?>,
    val andreYtelser: AndreYtelser,
    val uregistrertEllerVenterBarn: Opplysning<Svar>,
    val forholdTilAvdoede: ForholdTilAvdoede,
) : Person {
    override val type = PersonType.GJENLEVENDE
}
