import {
    AarstallForMilitaerTjeneste,
    BetingetOpplysning,
    DatoSvar,
    EnumSvar,
    FritekstSvar,
    JaNeiVetIkke,
    Kontaktinfo,
    Naeringsinntekt,
    Opplysning,
    Utenlandsadresse,
    Utenlandsopphold,
} from './FellesOpplysninger'

type Foedselsnummer = String

export enum PersonType {
    INNSENDER = 'INNSENDER',
    GJENLEVENDE = 'GJENLEVENDE',
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
    naeringsInntekt: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Naeringsinntekt> // Ikke nødvendig nytt regelverk for barnep.
    militaertjeneste: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Opplysning<AarstallForMilitaerTjeneste>> // Ikke nødvendig nytt regelverk for barnep.
    doedsaarsakSkyldesYrkesskadeEllerYrkessykdom: Opplysning<EnumSvar<JaNeiVetIkke>>
}

export interface Verge extends Person {
    type: PersonType.VERGE

    fornavn?: Opplysning<String>
    etternavn?: Opplysning<String>
    foedselsnummer?: Opplysning<Foedselsnummer>
}
