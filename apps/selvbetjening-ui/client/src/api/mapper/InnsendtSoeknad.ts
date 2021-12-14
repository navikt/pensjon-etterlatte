export type Foedselsnummer = String;

export enum SoeknadType {
    GJENLEVENDEPENSJON = "GJENLEVENDEPENSJON",
    BARNEPENSJON = "BARNEPENSJON",
}

export interface Opplysning<T> {
    spoersmaal: String;
    svar: T;
}

export interface BetingetOpplysning<T, R> {
    spoersmaal: String;
    svar: T;
    opplysning?: R;
}

export enum Svar {
    JA = "JA",
    NEI = "NEI",
    VET_IKKE = "VET_IKKE"
}

export interface SoeknadRequest {
    soeknader: InnsendtSoeknad[]
}

interface InnsendtSoeknad {
    type: SoeknadType;

    innsender: Person;
    harSamtykket: Opplysning<Boolean>;
    utbetalingsInformasjon: BetingetOpplysning<BankkontoType, UtbetalingsInformasjon>;
}

export interface Gjenlevendepensjon extends InnsendtSoeknad {
    soeker: Gjenlevende;
    avdoed: Avdoed;
    barn: Barn[];
}

export interface Barnepensjon extends InnsendtSoeknad {
    soeker: Barn;
    foreldre: Person[] | undefined;
    soesken: Barn[];
}


/* PERSON */

export interface Person {
    type: PersonType;
    fornavn: String;
    etternavn: String;
    foedselsnummer: Foedselsnummer;
}

export enum PersonType {
    INNSENDER = "INNSENDER",
    GJENLEVENDE = "GJENLEVENDE",
    AVDOED = "AVDOED",
    SAMBOER = "SAMBOER",
    VERGE = "VERGE",
    BARN = "BARN",
    FORELDER = "FORELDER",
    GJENLEVENDE_FORELDER = "GJENLEVENDE_FORELDER",
}

export enum OmsorgspersonType {
    GJENLEVENDE = "GJENLEVENDE",
    VERGE = "VERGE",
    ANNET = "ANNET"
}

export interface Innsender extends Person {
    type: PersonType.INNSENDER;

    fornavn: String;
    etternavn: String;
    foedselsnummer: Foedselsnummer;
}


export interface Forelder extends Person {
    type: PersonType.FORELDER;

    fornavn: String;
    etternavn: String;
    foedselsnummer: Foedselsnummer;
}

export interface GjenlevendeForelder extends Person {
    type: PersonType.GJENLEVENDE_FORELDER;

    fornavn: String;
    etternavn: String;
    foedselsnummer: Foedselsnummer;

    statsborgerskap: Opplysning<String>;
    adresse?: Opplysning<String>;
    kontaktinfo: Kontaktinfo;
}

export interface Gjenlevende extends Person {
    type: PersonType.GJENLEVENDE;

    fornavn: String;
    etternavn: String;
    foedselsnummer: Foedselsnummer;

    statsborgerskap: String;
    sivilstatus: String

    adresse?: Opplysning<String>;
    bostedsAdresse?: BetingetOpplysning<Svar, Opplysning<String>>;
    kontaktinfo: Kontaktinfo;
    flyktning?: Opplysning<Svar>;
    oppholdUtland?: BetingetOpplysning<Svar, OppholdUtland>;
    nySivilstatus?: BetingetOpplysning<SivilstatusType, Samboer>;
    arbeidOgUtdanning: ArbeidOgUtdanning;
    fullfoertUtdanning?: BetingetOpplysning<HoeyesteUtdanning, Opplysning<AnnenUtdanning>>;
    andreYtelser: AndreYtelser;
    uregistrertEllerVenterBarn: Opplysning<Svar>;
    forholdTilAvdoede: ForholdTilAvdoede;
}

export interface Barn extends Person {
    type: PersonType.BARN

    fornavn: String;
    etternavn: String;
    foedselsnummer: Foedselsnummer;

    statsborgerskap: Opplysning<String>;
    utenlandsAdresse?: BetingetOpplysning<Svar, Utenlandsadresse | undefined>;
    foreldre: Forelder[];
    verge?: BetingetOpplysning<Svar, Verge>;
    dagligOmsorg?: Opplysning<OmsorgspersonType>
}

export interface Avdoed extends Person {
    type: PersonType.AVDOED;

    fornavn: String;
    etternavn: String;
    foedselsnummer: Foedselsnummer;

    datoForDoedsfallet: Opplysning<Date>;
    statsborgerskap: Opplysning<String>;
    utenlandsopphold: BetingetOpplysning<Svar, Utenlandsopphold[] | undefined>;
    naeringsInntekt: BetingetOpplysning<Svar, Naeringsinntekt>;                 // Ikke nødvendig nytt regelverk for barnep.
    militaertjeneste: BetingetOpplysning<Svar, Opplysning<AarstallForMilitaerTjeneste>>;    // Ikke nødvendig nytt regelverk for barnep.
    doedsaarsakSkyldesYrkesskadeEllerYrkessykdom: Opplysning<Svar>;
}

export interface Verge extends Person {
    fornavn: String;
    etternavn: String;
    foedselsnummer: Foedselsnummer;
    type: PersonType.VERGE;
}

export interface Samboer extends Person {
    type: PersonType.SAMBOER;

    fornavn: String;
    etternavn: String;
    foedselsnummer: Foedselsnummer;

    fellesBarnEllertidligereGift: Opplysning<Svar>;
    inntekt?: BetingetOpplysning<Svar, SamboerInntekt | undefined>;
}


/* OPPLYSNINGER */

export interface Utenlandsadresse {
    land: Opplysning<String>,
    adresse: Opplysning<String>
}

export interface UtbetalingsInformasjon {
    kontonummer?: Opplysning<String>;
    utenlandskBankNavn?: Opplysning<String>;
    utenlandskBankAdresse?: Opplysning<String>;
    iban?: Opplysning<String>;
    swift?: Opplysning<String>;
    skattetrekk?: BetingetOpplysning<Svar, Opplysning<String> | undefined>;
}

export interface Kontaktinfo {
    epost: Opplysning<String>;
    telefonnummer: Opplysning<String>;
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
    INGEN = "INGEN",
    EKTESKAP = "EKTESKAP",
    SAMBOERSKAP = "SAMBOERSKAP"
}

export interface SamboerInntekt {
    inntektstype: Opplysning<InntektType[]>;
    samletBruttoinntektPrAar: Opplysning<String>;
}

export interface ForholdTilAvdoede {
    relasjon: Opplysning<ForholdTilAvdoedeType>;
    datoForInngaattPartnerskap?: Opplysning<Date>;
    datoForInngaattSamboerskap?: Opplysning<Date>;
    datoForSkilsmisse?: Opplysning<Date>;
    datoForSamlivsbrudd?: Opplysning<Date>;
    fellesBarn?: Opplysning<Svar>;
    samboereMedFellesBarnFoerGiftemaal?: Opplysning<Svar>;
    tidligereGift?: Opplysning<Svar>;
    omsorgForBarn?: Opplysning<Svar>; // Finner ikke igjen i søknadsdialogen. Flyttet til barn
    mottokBidrag?: Opplysning<Svar>; // Finner ikke igjen
    mottokEktefelleBidrag?: Opplysning<Svar>; // Finner ikke igjen?
}

export interface Utenlandsopphold {
    land: Opplysning<String>;
    fraDato?: Opplysning<Date>;
    tilDato?: Opplysning<Date>;
    oppholdsType: Opplysning<OppholdUtlandType[]>;
    medlemFolketrygd: Opplysning<String>;
    pensjonsutbetaling?: Opplysning<String>;
}

export interface Naeringsinntekt {
    naeringsinntektPrAarFoerDoedsfall?: Opplysning<String>;
    naeringsinntektVedDoedsfall?: Opplysning<Svar>;
}

export type AarstallForMilitaerTjeneste = String

export interface ArbeidOgUtdanning {
    dinSituasjon: Opplysning<JobbStatusType[]>;
    arbeidsforhold?: Opplysning<Arbeidstaker[]>;
    selvstendig?: Opplysning<SelvstendigNaeringsdrivende[]>;
    utdanning?: Opplysning<Utdanning>;
    annet?: Opplysning<String>;
}


// TODO: naavaerende utdanning + tidligere

export interface Utdanning {
    navn: Opplysning<String>;
    startDato: Opplysning<Date>;
    sluttDato: Opplysning<Date>;
}

export type AnnenUtdanning = String;

export enum HoeyesteUtdanning {
    GRUNNSKOLE = "GRUNNSKOLE",
    VIDEREGAAENDE = "VIDEREGAAENDE",
    FAGBREV = "FAGBREV",
    UNIVERSITET_OPPTIL_4_AAR = "UNIVERSITET_OPPTIL_4_AAR",
    UNIVERSITET_OVER_4_AAR = "UNIVERSITET_OVER_4_AAR",
    INGEN = "INGEN",
    ANNEN = "ANNEN"
}

export type EndretInntektBegrunnelse = String;

export interface SelvstendigNaeringsdrivende {
    firmanavn: Opplysning<String>;
    orgnr: Opplysning<String>;
    endretInntekt: BetingetOpplysning<Svar, Opplysning<EndretInntektBegrunnelse> | undefined>;
}

export interface Arbeidstaker {
    arbeidsgiver: Opplysning<String>;
    ansettelsesforhold: Opplysning<StillingType>;
    stillingsprosent: Opplysning<String>;
    endretInntekt: BetingetOpplysning<Svar, Opplysning<EndretInntektBegrunnelse> | undefined>;
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

export type Pensjonsordning = String;

export interface AndreYtelser {
    kravOmAnnenStonad: BetingetOpplysning<Svar, Opplysning<Ytelser> | undefined>;
    annenPensjon: BetingetOpplysning<Svar, Opplysning<Pensjonsordning> | undefined>;
    pensjonUtland: BetingetOpplysning<Svar, PensjonUtland | undefined>;
}


export interface PensjonUtland {
    pensjonsType?: Opplysning<String>;
    land?: Opplysning<String>;
    bruttobeloepPrAar?: Opplysning<String>;
}


export interface OppholdUtland {
    land: Opplysning<String>;
    medlemFolketrygd: Opplysning<Svar>;
}

