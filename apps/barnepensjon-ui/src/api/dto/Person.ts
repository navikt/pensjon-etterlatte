import {
    BetingetOpplysning,
    DatoSvar,
    EnumSvar,
    FritekstSvar,
    JaNeiVetIkke,
    Kontaktinfo,
    OppholdUtland,
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
    foedselsdato?: Opplysning<string>
}

export interface Innsender extends Person {
    type: PersonType.INNSENDER

    fornavn: Opplysning<string>
    etternavn: Opplysning<string>
    foedselsnummer: Opplysning<Foedselsnummer>
    foedselsdato?: Opplysning<string>
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

export interface Barn extends Person {
    type: PersonType.BARN

    fornavn: Opplysning<string>
    etternavn: Opplysning<string>
    foedselsnummer?: Opplysning<Foedselsnummer>
    foedselsdato?: Opplysning<string>

    statsborgerskap: Opplysning<string>
    utenlandsAdresse?: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Utenlandsadresse | undefined>
    bosattNorge?: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, OppholdUtland | undefined>
    foreldre: Forelder[]
    ukjentForelder?: Opplysning<string>
    verge?: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Verge>
    dagligOmsorg?: Opplysning<EnumSvar<OmsorgspersonType>>
    ufoeretrygd?: Opplysning<EnumSvar<JaNeiVetIkke>>
    arbeidsavklaringspenger?: Opplysning<EnumSvar<JaNeiVetIkke>>
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
}
