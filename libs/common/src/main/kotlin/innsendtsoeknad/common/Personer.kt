package no.nav.etterlatte.libs.common.innsendtsoeknad.common

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import no.nav.etterlatte.libs.common.innsendtsoeknad.AarstallForMilitaerTjeneste
import no.nav.etterlatte.libs.common.innsendtsoeknad.Naeringsinntekt
import no.nav.etterlatte.libs.common.innsendtsoeknad.OmsorgspersonType
import no.nav.etterlatte.libs.common.innsendtsoeknad.SamboerInntekt
import no.nav.etterlatte.libs.common.innsendtsoeknad.Utenlandsadresse
import no.nav.etterlatte.libs.common.innsendtsoeknad.Utenlandsopphold
import no.nav.etterlatte.libs.common.innsendtsoeknad.barnepensjon.GjenlevendeForelder
import no.nav.etterlatte.libs.common.innsendtsoeknad.gjenlevendepensjon.Gjenlevende
import no.nav.etterlatte.libs.common.person.Foedselsnummer
import java.time.LocalDate

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.EXISTING_PROPERTY,
    property = "type"
)
@JsonSubTypes(
    JsonSubTypes.Type(value = Gjenlevende::class, name = "GJENLEVENDE"),
    JsonSubTypes.Type(value = GjenlevendeForelder::class, name = "GJENLEVENDE_FORELDER"),
    JsonSubTypes.Type(value = Avdoed::class, name = "AVDOED"),
    JsonSubTypes.Type(value = Samboer::class, name = "SAMBOER"),
    JsonSubTypes.Type(value = Verge::class, name = "VERGE"),
    JsonSubTypes.Type(value = Barn::class, name = "BARN"),
    JsonSubTypes.Type(value = Forelder::class, name = "FORELDER"),
    JsonSubTypes.Type(value = Innsender::class, name = "INNSENDER"),
)
interface Person {
    val type: PersonType
    val fornavn: String
    val etternavn: String
    val foedselsnummer: Foedselsnummer
}

enum class PersonType {
    INNSENDER,
    GJENLEVENDE,
    GJENLEVENDE_FORELDER,
    AVDOED,
    SAMBOER,
    VERGE,
    BARN,
    FORELDER
}

data class Innsender(
    override val fornavn: String,
    override val etternavn: String,
    override val foedselsnummer: Foedselsnummer
) : Person {
    override val type: PersonType = PersonType.INNSENDER
}

data class Forelder(
    override val fornavn: String,
    override val etternavn: String,
    override val foedselsnummer: Foedselsnummer
) : Person {
    override val type: PersonType = PersonType.FORELDER
}

data class Barn(
    override val fornavn: String,
    override val etternavn: String,
    override val foedselsnummer: Foedselsnummer,

    val statsborgerskap: Opplysning<FritekstSvar>,
    val utenlandsAdresse: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Utenlandsadresse?>?,
    val foreldre: List<Forelder>,
    val verge: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Verge>?,
    val dagligOmsorg: Opplysning<EnumSvar<OmsorgspersonType>>?
) : Person {
    override val type = PersonType.BARN
}

data class Avdoed(
    override val fornavn: String,
    override val etternavn: String,
    override val foedselsnummer: Foedselsnummer,

    val datoForDoedsfallet: Opplysning<DatoSvar>,
    val statsborgerskap: Opplysning<FritekstSvar>,
    val utenlandsopphold: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, List<Utenlandsopphold>>,
    val doedsaarsakSkyldesYrkesskadeEllerYrkessykdom: Opplysning<EnumSvar<JaNeiVetIkke>>,

    // Næringsinntekt og militærtjeneste er kun relevant dersom begge foreldrene er døde.
    val naeringsInntekt: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Naeringsinntekt?>?,
    val militaertjeneste: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Opplysning<AarstallForMilitaerTjeneste>?>?
) : Person {
    override val type = PersonType.AVDOED
}

data class Verge(
    override val fornavn: String,
    override val etternavn: String,
    override val foedselsnummer: Foedselsnummer,
) : Person {
    override val type = PersonType.VERGE
}

data class Samboer(
    override val fornavn: String,
    override val etternavn: String,
    override val foedselsnummer: Foedselsnummer,

    val fellesBarnEllertidligereGift: Opplysning<JaNeiVetIkke>,
    val inntekt: BetingetOpplysning<JaNeiVetIkke, SamboerInntekt?>?,
) : Person {
    override val type = PersonType.SAMBOER
}
