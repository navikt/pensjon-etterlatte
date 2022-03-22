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
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.JaNeiVetIkke
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import innsendtsoeknad.common.SoeknadType
import no.nav.etterlatte.libs.common.innsendtsoeknad.Spraak
import no.nav.etterlatte.libs.common.innsendtsoeknad.Stoenader
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.EnumSvar
import no.nav.etterlatte.libs.common.innsendtsoeknad.common.FritekstSvar
import java.time.LocalDateTime

@JsonIgnoreProperties(ignoreUnknown = true)
data class Gjenlevendepensjon(
    override val imageTag: ImageTag,
    override val kilde: String,
    override val spraak: Spraak,
    override val innsender: Innsender,
    override val soeker: Gjenlevende,
    override val harSamtykket: Opplysning<Boolean>,
    override val utbetalingsInformasjon: BetingetOpplysning<EnumSvar<BankkontoType>, UtbetalingsInformasjon>?,

    val avdoed: Avdoed,
    val barn: List<Barn>,
    val andreStoenader: List<Opplysning<EnumSvar<Stoenader>>> = emptyList()
) : InnsendtSoeknad {
    override val versjon = "2"
    override val type: SoeknadType = SoeknadType.GJENLEVENDEPENSJON
    override val mottattDato: LocalDateTime = LocalDateTime.now()
}

data class Gjenlevende(
    override val fornavn: Opplysning<String>,
    override val etternavn: Opplysning<String>,
    override val foedselsnummer: Opplysning<Foedselsnummer>,

    val statsborgerskap: Opplysning<String>,
    val sivilstatus: Opplysning<String>,
    val adresse: Opplysning<String>?,
    val bostedsAdresse: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Opplysning<FritekstSvar>?>?,
    val kontaktinfo: Kontaktinfo,
    val flyktning: Opplysning<EnumSvar<JaNeiVetIkke>>?,
    val oppholdUtland: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, OppholdUtland?>?,
    val nySivilstatus: BetingetOpplysning<EnumSvar<SivilstatusType>, Samboer?>,
    val arbeidOgUtdanning: ArbeidOgUtdanning?,
    val fullfoertUtdanning: BetingetOpplysning<EnumSvar<HoeyesteUtdanning>, Opplysning<AnnenUtdanning>?>?,
    val andreYtelser: AndreYtelser,
    val uregistrertEllerVenterBarn: Opplysning<EnumSvar<JaNeiVetIkke>>,
    val forholdTilAvdoede: ForholdTilAvdoede,
) : Person {
    override val type = PersonType.GJENLEVENDE
}
