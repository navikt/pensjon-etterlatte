import {
    ArbeidOgUtdanning,
    BetingetOpplysning,
    ForholdTilAvdoede,
    HoeyesteUtdanning,
    Kontaktinfo,
    OppholdUtland,
    Opplysning,
    SivilstatusType,
    EnumSvar,
    JaNeiVetIkke,
    Utenlandsadresse,
    Utenlandsopphold,
    FritekstSvar,
    DatoSvar,
    InntektOgPensjon,
} from './FellesOpplysninger'

type Foedselsnummer = string

export enum PersonType {
    INNSENDER = 'INNSENDER',
    GJENLEVENDE_OMS = 'GJENLEVENDE_OMS',
    AVDOED = 'AVDOED',
    SAMBOER = 'SAMBOER',
    VERGE = 'VERGE',
    BARN = 'BARN',
    FORELDER = 'FORELDER',
    GJENLEVENDE_FORELDER = 'GJENLEVENDE_FORELDER',
}

export enum OmsorgspersonType {
    GJENLEVENDE = 'GJENLEVENDE',
    ANNET = 'ANNET',
}

export interface Person {
    type: PersonType
    fornavn?: Opplysning<string>
    etternavn?: Opplysning<string>
    foedselsnummer?: Opplysning<Foedselsnummer>
    foedselsdato?: Opplysning<string>
}

export interface Innsender extends Person {
    type: PersonType.INNSENDER

    fornavn: Opplysning<string>
    etternavn: Opplysning<string>
    foedselsnummer: Opplysning<Foedselsnummer>
}

export interface Forelder extends Person {
    type: PersonType.FORELDER

    fornavn: Opplysning<string>
    etternavn: Opplysning<string>
    foedselsnummer?: Opplysning<Foedselsnummer>
    foedselsdato?: Opplysning<string>
}

export interface GjenlevendeForelder extends Person {
    type: PersonType.GJENLEVENDE_FORELDER

    fornavn: Opplysning<string>
    etternavn: Opplysning<string>
    foedselsnummer?: Opplysning<Foedselsnummer>
    foedselsdato?: Opplysning<string>

    statsborgerskap: Opplysning<string>
    adresse?: Opplysning<string>
    kontaktinfo: Kontaktinfo
}

export interface Gjenlevende extends Person {
    type: PersonType.GJENLEVENDE_OMS

    fornavn: Opplysning<string>
    etternavn: Opplysning<string>
    foedselsnummer?: Opplysning<Foedselsnummer>
    foedselsdato?: Opplysning<string>

    statsborgerskap: Opplysning<string>
    sivilstatus: Opplysning<string>

    adresse?: Opplysning<string>
    bostedsAdresse?: Opplysning<FritekstSvar>
    kontaktinfo: Kontaktinfo
    flyktning?: Opplysning<EnumSvar<JaNeiVetIkke>>
    oppholdUtland?: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, OppholdUtland>
    nySivilstatus?: BetingetOpplysning<EnumSvar<SivilstatusType>, Samboer>
    arbeidOgUtdanning?: ArbeidOgUtdanning
    inntektOgPensjon: InntektOgPensjon
    fullfoertUtdanning?: Opplysning<EnumSvar<HoeyesteUtdanning>[]>
    uregistrertEllerVenterBarn: Opplysning<EnumSvar<JaNeiVetIkke>>
    forholdTilAvdoede: ForholdTilAvdoede
    omsorgForBarn: Opplysning<EnumSvar<JaNeiVetIkke>>
}

export interface Barn extends Person {
    type: PersonType.BARN

    fornavn: Opplysning<string>
    etternavn: Opplysning<string>
    foedselsnummer?: Opplysning<Foedselsnummer>
    foedselsdato?: Opplysning<string>

    statsborgerskap: Opplysning<string>
    utenlandsAdresse?: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Utenlandsadresse | undefined>
    foreldre: Forelder[]
    verge?: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Verge>
    dagligOmsorg?: Opplysning<EnumSvar<OmsorgspersonType>>
}

export interface Avdoed extends Person {
    type: PersonType.AVDOED

    fornavn: Opplysning<string>
    etternavn: Opplysning<string>
    foedselsnummer?: Opplysning<Foedselsnummer>
    foedselsdato?: Opplysning<string>

    datoForDoedsfallet: Opplysning<DatoSvar>
    statsborgerskap: Opplysning<FritekstSvar>
    utenlandsopphold: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Utenlandsopphold[] | undefined>
    doedsaarsakSkyldesYrkesskadeEllerYrkessykdom: Opplysning<EnumSvar<JaNeiVetIkke>>
}

export interface Verge extends Person {
    type: PersonType.VERGE

    fornavn?: Opplysning<string>
    etternavn?: Opplysning<string>
    foedselsnummer?: Opplysning<Foedselsnummer>
    foedselsdato?: Opplysning<string>
}

export interface Samboer extends Person {
    type: PersonType.SAMBOER

    fornavn: Opplysning<string>
    etternavn: Opplysning<string>
    foedselsnummer?: Opplysning<Foedselsnummer>
    foedselsdato?: Opplysning<string>

    fellesBarnEllertidligereGift: Opplysning<EnumSvar<JaNeiVetIkke>>
}
