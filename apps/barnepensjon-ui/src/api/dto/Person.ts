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

type Foedselsnummer = string

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
    fornavn?: Opplysning<string>
    etternavn?: Opplysning<string>
    foedselsnummer?: Opplysning<Foedselsnummer>
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
    foedselsnummer: Opplysning<Foedselsnummer>
}

export interface GjenlevendeForelder extends Person {
    type: PersonType.GJENLEVENDE_FORELDER

    fornavn: Opplysning<string>
    etternavn: Opplysning<string>
    foedselsnummer: Opplysning<Foedselsnummer>

    statsborgerskap: Opplysning<string>
    adresse?: Opplysning<string>
    kontaktinfo: Kontaktinfo
}

export interface Barn extends Person {
    type: PersonType.BARN

    fornavn: Opplysning<string>
    etternavn: Opplysning<string>
    foedselsnummer: Opplysning<Foedselsnummer>

    statsborgerskap: Opplysning<string>
    utenlandsAdresse?: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Utenlandsadresse | undefined>
    foreldre: Forelder[]
    verge?: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Verge>
    dagligOmsorg?: Opplysning<EnumSvar<OmsorgspersonType>>
}

export interface BarnOver18 extends Person {
    type: PersonType.BARN

    fornavn: Opplysning<string>
    etternavn: Opplysning<string>
    foedselsnummer: Opplysning<Foedselsnummer>

    statsborgerskap: Opplysning<string>
    utenlandsAdresse?: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Utenlandsadresse | undefined>
    dagligOmsorg?: Opplysning<EnumSvar<OmsorgspersonType>>
}

export interface Avdoed extends Person {
    type: PersonType.AVDOED

    fornavn: Opplysning<string>
    etternavn: Opplysning<string>
    foedselsnummer: Opplysning<Foedselsnummer>

    datoForDoedsfallet: Opplysning<DatoSvar>
    statsborgerskap: Opplysning<FritekstSvar>
    utenlandsopphold: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Utenlandsopphold[] | undefined>
    naeringsInntekt: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Naeringsinntekt> | undefined
    militaertjeneste: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Opplysning<AarstallForMilitaerTjeneste>> | undefined
    doedsaarsakSkyldesYrkesskadeEllerYrkessykdom: Opplysning<EnumSvar<JaNeiVetIkke>>
}

export interface Verge extends Person {
    type: PersonType.VERGE

    fornavn?: Opplysning<string>
    etternavn?: Opplysning<string>
    foedselsnummer?: Opplysning<Foedselsnummer>
}
