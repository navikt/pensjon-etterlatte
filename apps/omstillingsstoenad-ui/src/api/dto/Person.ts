import {
    ArbeidOgUtdanning,
    BetingetOpplysning,
    ForholdTilAvdoede,
    HoeyesteUtdanning,
    Kontaktinfo,
    NaeringsinntektAvdoed,
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

type Foedselsnummer = String

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
    fornavn?: Opplysning<String>
    etternavn?: Opplysning<String>
    foedselsnummer?: Opplysning<Foedselsnummer>
}

export interface Innsender extends Person {
    type: PersonType.INNSENDER

    fornavn: Opplysning<String>
    etternavn: Opplysning<String>
    foedselsnummer: Opplysning<Foedselsnummer>
}

export interface Forelder extends Person {
    type: PersonType.FORELDER

    fornavn: Opplysning<String>
    etternavn: Opplysning<String>
    foedselsnummer: Opplysning<Foedselsnummer>
}

export interface GjenlevendeForelder extends Person {
    type: PersonType.GJENLEVENDE_FORELDER

    fornavn: Opplysning<String>
    etternavn: Opplysning<String>
    foedselsnummer: Opplysning<Foedselsnummer>

    statsborgerskap: Opplysning<String>
    adresse?: Opplysning<String>
    kontaktinfo: Kontaktinfo
}

export interface Gjenlevende extends Person {
    type: PersonType.GJENLEVENDE_OMS

    fornavn: Opplysning<String>
    etternavn: Opplysning<String>
    foedselsnummer: Opplysning<Foedselsnummer>

    statsborgerskap: Opplysning<String>
    sivilstatus: Opplysning<String>

    adresse?: Opplysning<String>
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

    fornavn: Opplysning<String>
    etternavn: Opplysning<String>
    foedselsnummer: Opplysning<Foedselsnummer>

    statsborgerskap: Opplysning<String>
    utenlandsAdresse?: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Utenlandsadresse | undefined>
    foreldre: Forelder[]
    verge?: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Verge>
    dagligOmsorg?: Opplysning<EnumSvar<OmsorgspersonType>>
}

export interface Avdoed extends Person {
    type: PersonType.AVDOED

    fornavn: Opplysning<String>
    etternavn: Opplysning<String>
    foedselsnummer: Opplysning<Foedselsnummer>

    datoForDoedsfallet: Opplysning<DatoSvar>
    statsborgerskap: Opplysning<FritekstSvar>
    utenlandsopphold: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Utenlandsopphold[] | undefined>
    naeringsInntekt: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, NaeringsinntektAvdoed> // Ikke nødvendig nytt regelverk for barnep.
    doedsaarsakSkyldesYrkesskadeEllerYrkessykdom: Opplysning<EnumSvar<JaNeiVetIkke>>
}

export interface Verge extends Person {
    type: PersonType.VERGE

    fornavn?: Opplysning<String>
    etternavn?: Opplysning<String>
    foedselsnummer?: Opplysning<Foedselsnummer>
}

export interface Samboer extends Person {
    type: PersonType.SAMBOER

    fornavn: Opplysning<String>
    etternavn: Opplysning<String>
    foedselsnummer: Opplysning<Foedselsnummer>

    fellesBarnEllertidligereGift: Opplysning<EnumSvar<JaNeiVetIkke>>
}
