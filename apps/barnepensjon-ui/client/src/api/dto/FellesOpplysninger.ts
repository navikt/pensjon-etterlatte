export interface Opplysning<T> {
    spoersmaal: string
    svar: T
}

export interface BetingetOpplysning<T, R> {
    spoersmaal: string
    svar: T
    opplysning?: R
}

export interface Svar<T> {
    innhold: T
}

export interface FritekstSvar extends Svar<string> {
    innhold: string
}

export interface DatoSvar extends Svar<Date | string> {
    innhold: Date | string
}

export interface EnumSvar<E> extends Svar<string> {
    innhold: string
    verdi: E
}

export enum JaNeiVetIkke {
    JA = 'JA',
    NEI = 'NEI',
    VET_IKKE = 'VET_IKKE',
}

export interface Utenlandsadresse {
    land: Opplysning<FritekstSvar>
    adresse: Opplysning<FritekstSvar>
}

export interface UtbetalingsInformasjon {
    kontonummer?: Opplysning<FritekstSvar>
    utenlandskBankNavn?: Opplysning<FritekstSvar>
    utenlandskBankAdresse?: Opplysning<FritekstSvar>
    iban?: Opplysning<FritekstSvar>
    swift?: Opplysning<FritekstSvar>
    skattetrekk?: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Opplysning<FritekstSvar> | undefined>
}

export interface Kontaktinfo {
    telefonnummer: Opplysning<FritekstSvar>
}

export enum BankkontoType {
    NORSK = 'NORSK',
    UTENLANDSK = 'UTENLANDSK',
}

export enum OppholdUtlandType {
    BODD = 'BODD',
    ARBEIDET = 'ARBEIDET',
}

export enum StillingType {
    FAST = 'FAST',
    MIDLERTIDIG = 'MIDLERTIDIG',
    SESONGARBEID = 'SESONGARBEID',
}

export interface Utenlandsopphold {
    land: Opplysning<FritekstSvar>
    fraDato?: Opplysning<DatoSvar>
    tilDato?: Opplysning<DatoSvar>
    oppholdsType: Opplysning<EnumSvar<OppholdUtlandType>[]>
    medlemFolketrygd: Opplysning<EnumSvar<JaNeiVetIkke>>
    pensjonsutbetaling?: Opplysning<FritekstSvar>
}

export interface Naeringsinntekt {
    naeringsinntektPrAarFoerDoedsfall?: Opplysning<FritekstSvar>
    naeringsinntektVedDoedsfall?: Opplysning<EnumSvar<JaNeiVetIkke>>
}

export type AarstallForMilitaerTjeneste = FritekstSvar

export type EndretInntektBegrunnelse = FritekstSvar

export interface Arbeidstaker {
    arbeidsgiver: Opplysning<FritekstSvar>
    ansettelsesforhold: Opplysning<EnumSvar<StillingType>>
    stillingsprosent: Opplysning<FritekstSvar>
    endretInntekt: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Opplysning<EndretInntektBegrunnelse> | undefined>
}

export enum Stoenader {
    BARNETILSYN = 'BARNETILSYN',
    SKOLEPENGER = 'SKOLEPENGER',
    TILLEGGSSTOENAD_BARNEPASS = 'TILLEGGSSTOENAD_BARNEPASS',
    TILLEGGSSTOENAD_UTDANNING = 'TILLEGGSSTOENAD_UTDANNING',
}
