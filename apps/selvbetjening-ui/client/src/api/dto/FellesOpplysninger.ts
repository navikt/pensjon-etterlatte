export interface Opplysning<T> {
    spoersmaal: String;
    svar: T;
}

export interface BetingetOpplysning<T, R> {
    spoersmaal: String;
    svar: T;
    opplysning?: R;
}

export interface Svar<T> {
    innhold: T;
}

export interface FritekstSvar extends Svar<String> {
    innhold: String;
}

export interface DatoSvar extends Svar<Date | String> {
    innhold: Date | String;
}

export interface EnumSvar<E> extends Svar<String> {
    innhold: String;
    verdi: E;
}

export enum JaNeiVetIkke {
    JA = "JA",
    NEI = "NEI",
    VET_IKKE = "VET_IKKE"
}

export interface Utenlandsadresse {
    land: Opplysning<FritekstSvar>,
    adresse: Opplysning<FritekstSvar>
}

export interface UtbetalingsInformasjon {
    kontonummer?: Opplysning<FritekstSvar>;
    utenlandskBankNavn?: Opplysning<FritekstSvar>;
    utenlandskBankAdresse?: Opplysning<FritekstSvar>;
    iban?: Opplysning<FritekstSvar>;
    swift?: Opplysning<FritekstSvar>;
    skattetrekk?: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Opplysning<FritekstSvar> | undefined>;
}

export interface Kontaktinfo {
    telefonnummer: Opplysning<FritekstSvar>;
}

export enum BankkontoType {
    NORSK = "NORSK",
    UTENLANDSK = "UTENLANDSK"
}

export enum InntektType {
    ARBEIDSINNTEKT = "ARBEIDSINNTEKT",
    PENSJON = "PENSJON",
    KAPITALINNTEKT = "KAPITALINNTEKT",
    ANDRE_YTELSER = "ANDRE_YTELSER"
}

export enum ForholdTilAvdoedeType {
    GIFT = "GIFT",
    SEPARERT = "SEPARERT",
    SAMBOER = "SAMBOER",
    SKILT = "SKILT",
    TIDLIGERE_SAMBOER = "TIDLIGERE_SAMBOER"
}

export enum OppholdUtlandType {
    BODD = "BODD",
    ARBEIDET = "ARBEIDET"
}

export enum JobbStatusType {
    ARBEIDSTAKER = "ARBEIDSTAKER",
    SELVSTENDIG = "SELVSTENDIG",
    UNDER_UTDANNING = "UNDER_UTDANNING",
    INGEN = "INGEN"
}

export enum StillingType {
    FAST = "FAST",
    MIDLERTIDIG = "MIDLERTIDIG",
    SESONGARBEID = "SESONGARBEID"
}

export enum SivilstatusType {
    ENSLIG = "ENSLIG",
    EKTESKAP = "EKTESKAP",
    SAMBOERSKAP = "SAMBOERSKAP"
}

export interface SamboerInntekt {
    inntektstype: Opplysning<EnumSvar<InntektType>[]>;
    samletBruttoinntektPrAar: Opplysning<FritekstSvar>;
}

export interface ForholdTilAvdoede {
    relasjon: Opplysning<EnumSvar<ForholdTilAvdoedeType>>;
    datoForInngaattPartnerskap?: Opplysning<DatoSvar>;
    datoForInngaattSamboerskap?: Opplysning<DatoSvar>;
    datoForSkilsmisse?: Opplysning<DatoSvar>;
    datoForSamlivsbrudd?: Opplysning<DatoSvar>;
    fellesBarn?: Opplysning<EnumSvar<JaNeiVetIkke>>;
    samboereMedFellesBarnFoerGiftemaal?: Opplysning<EnumSvar<JaNeiVetIkke>>;
    tidligereGift?: Opplysning<EnumSvar<JaNeiVetIkke>>;
    omsorgForBarn?: Opplysning<EnumSvar<JaNeiVetIkke>>; // Finner ikke igjen i søknadsdialogen. Flyttet til barn
    mottokBidrag?: Opplysning<EnumSvar<JaNeiVetIkke>>; // Finner ikke igjen
    mottokEktefelleBidrag?: Opplysning<EnumSvar<JaNeiVetIkke>>; // Finner ikke igjen?
}

export interface Utenlandsopphold {
    land: Opplysning<FritekstSvar>;
    fraDato?: Opplysning<DatoSvar>;
    tilDato?: Opplysning<DatoSvar>;
    oppholdsType: Opplysning<EnumSvar<OppholdUtlandType>[]>;
    medlemFolketrygd: Opplysning<EnumSvar<JaNeiVetIkke>>;
    pensjonsutbetaling?: Opplysning<FritekstSvar>;
}

export interface Naeringsinntekt {
    naeringsinntektPrAarFoerDoedsfall?: Opplysning<FritekstSvar>;
    naeringsinntektVedDoedsfall?: Opplysning<EnumSvar<JaNeiVetIkke>>;
}

export type AarstallForMilitaerTjeneste = FritekstSvar

export interface ArbeidOgUtdanning {
    dinSituasjon: Opplysning<EnumSvar<JobbStatusType>[]>;
    arbeidsforhold?: Opplysning<Arbeidstaker[]>;
    selvstendig?: Opplysning<SelvstendigNaeringsdrivende[]>;
    utdanning?: Opplysning<Utdanning>;
    annet?: Opplysning<FritekstSvar>;
}


// TODO: naavaerende utdanning + tidligere

export interface Utdanning {
    navn: Opplysning<FritekstSvar>;
    startDato: Opplysning<DatoSvar>;
    sluttDato: Opplysning<DatoSvar>;
}

export type AnnenUtdanning = FritekstSvar;

export enum HoeyesteUtdanning {
    GRUNNSKOLE = "GRUNNSKOLE",
    VIDEREGAAENDE = "VIDEREGAAENDE",
    FAGBREV = "FAGBREV",
    UNIVERSITET_OPPTIL_4_AAR = "UNIVERSITET_OPPTIL_4_AAR",
    UNIVERSITET_OVER_4_AAR = "UNIVERSITET_OVER_4_AAR",
    INGEN = "INGEN",
    ANNEN = "ANNEN"
}

export type EndretInntektBegrunnelse = FritekstSvar;

export interface SelvstendigNaeringsdrivende {
    firmanavn: Opplysning<FritekstSvar>;
    orgnr: Opplysning<FritekstSvar>;
    endretInntekt: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Opplysning<EndretInntektBegrunnelse> | undefined>;
}

export interface Arbeidstaker {
    arbeidsgiver: Opplysning<FritekstSvar>;
    ansettelsesforhold: Opplysning<EnumSvar<StillingType>>;
    stillingsprosent: Opplysning<FritekstSvar>;
    endretInntekt: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Opplysning<EndretInntektBegrunnelse> | undefined>;
}

export enum Ytelser {
    DAGPENGER = "DAGPENGER",
    SYKEPENGER = "SYKEPENGER",
    PLEIEPENGER = "PLEIEPENGER",
    SVANGERSKAPSPENGER = "SVANGERSKAPSPENGER",
    FORELDREPENGER = "FORELDREPENGER",
    ARBEIDSAVKLARINGSPENGER = "ARBEIDSAVKLARINGSPENGER",
    KVALIFISERINGSSTOENAD = "KVALIFISERINGSSTOENAD",
    KOMMUNAL_OMSORGSSTONAD = "KOMMUNAL_OMSORGSSTONAD",
    FOSTERHJEMSGODTGJOERING = "FOSTERHJEMSGODTGJOERING",
    OMSORGSPENGER = "OMSORGSPENGER",
    OPPLAERINGSPENGER = "OPPLAERINGSPENGER"
}

export type Pensjonsordning = FritekstSvar;

export interface AndreYtelser {
    kravOmAnnenStonad: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Opplysning<EnumSvar<Ytelser>> | undefined>;
    annenPensjon: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Opplysning<Pensjonsordning> | undefined>;
    pensjonUtland: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, PensjonUtland | undefined>;
}


export interface PensjonUtland {
    pensjonsType?: Opplysning<FritekstSvar>;
    land?: Opplysning<FritekstSvar>;
    bruttobeloepPrAar?: Opplysning<FritekstSvar>;
}

export interface OppholdUtland {
    land: Opplysning<FritekstSvar>;
    medlemFolketrygd: Opplysning<EnumSvar<JaNeiVetIkke>>;
}

export enum Stoenader {
    BARNETILSYN = "BARNETILSYN",
    SKOLEPENGER = "SKOLEPENGER",
    TILLEGGSSTOENAD_BARNEPASS = "TILLEGGSSTOENAD_BARNEPASS",
    TILLEGGSSTOENAD_UTDANNING = "TILLEGGSSTOENAD_BARNEPASS",
}
