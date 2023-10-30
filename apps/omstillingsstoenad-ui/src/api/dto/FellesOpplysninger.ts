export interface Opplysning<T> {
    spoersmaal: String
    svar: T
}

export interface BetingetOpplysning<T, R> {
    spoersmaal: String
    svar: T
    opplysning?: R
}

export interface Svar<T> {
    innhold: T
}

export interface FritekstSvar extends Svar<String> {
    innhold: String
}

export interface DatoSvar extends Svar<Date | String> {
    innhold: Date | String
}

export interface EnumSvar<E> extends Svar<String> {
    innhold: String
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

export enum InntektType {
    ARBEIDSINNTEKT = 'ARBEIDSINNTEKT',
    PENSJON = 'PENSJON',
    KAPITALINNTEKT = 'KAPITALINNTEKT',
    ANDRE_YTELSER = 'ANDRE_YTELSER',
}

export enum ForholdTilAvdoedeType {
    GIFT = 'GIFT',
    SEPARERT = 'SEPARERT',
    SAMBOER = 'SAMBOER',
    SKILT = 'SKILT',
    TIDLIGERE_SAMBOER = 'TIDLIGERE_SAMBOER',
}

export enum OppholdUtlandType {
    BODD = 'BODD',
    ARBEIDET = 'ARBEIDET',
}

export enum JobbStatusType {
    ARBEIDSTAKER = 'ARBEIDSTAKER',
    SELVSTENDIG_ENK = 'SELVSTENDIG_ENK',
    SELVSTENDIG_AS = 'SELVSTENDIG_AS',
    ETABLERER = 'ETABLERER',
    TILBUD = 'TILBUD',
    ARBEIDSSOEKER = 'ARBEIDSSOEKER',
    UNDER_UTDANNING = 'UNDER_UTDANNING',
    INGEN = 'INGEN',
}

export enum StillingType {
    FAST = 'FAST',
    MIDLERTIDIG = 'MIDLERTIDIG',
    TILKALLINGSVIKAR = 'TILKALLINGSVIKAR',
}

export enum SivilstatusType {
    ENSLIG = 'ENSLIG',
    EKTESKAP = 'EKTESKAP',
    SAMBOERSKAP = 'SAMBOERSKAP',
}

export enum SagtOppEllerRedusertType {
    OPPSAGT = "OPPSAGT",
    REDUSERT = "REDUSERT",
    NEI = "NEI"
}

export enum StudieformType {
    HELTID =  "HELTID",
    DELTID = "DELTID"
}

export interface SamboerInntekt {
    inntektstype: Opplysning<EnumSvar<InntektType>[]>
    samletBruttoinntektPrAar: Opplysning<FritekstSvar>
}

export interface ForholdTilAvdoede {
    relasjon: Opplysning<EnumSvar<ForholdTilAvdoedeType>>
    datoForInngaattPartnerskap?: Opplysning<DatoSvar>
    datoForInngaattSamboerskap?: Opplysning<DatoSvar>
    datoForSkilsmisse?: Opplysning<DatoSvar>
    datoForSamlivsbrudd?: Opplysning<DatoSvar>
    fellesBarn?: Opplysning<EnumSvar<JaNeiVetIkke>>
    samboereMedFellesBarnFoerGiftemaal?: Opplysning<EnumSvar<JaNeiVetIkke>>
    tidligereGift?: Opplysning<EnumSvar<JaNeiVetIkke>>
    omsorgForBarn?: Opplysning<EnumSvar<JaNeiVetIkke>> // Finner ikke igjen i søknadsdialogen. Flyttet til barn
    mottokBidrag?: Opplysning<EnumSvar<JaNeiVetIkke>> // Finner ikke igjen
    mottokEktefelleBidrag?: Opplysning<EnumSvar<JaNeiVetIkke>> // Finner ikke igjen?
}

export interface Utenlandsopphold {
    land: Opplysning<FritekstSvar>
    fraDato?: Opplysning<DatoSvar>
    tilDato?: Opplysning<DatoSvar>
    oppholdsType: Opplysning<EnumSvar<OppholdUtlandType>[]>
    medlemFolketrygd: Opplysning<EnumSvar<JaNeiVetIkke>>
    pensjonsutbetaling?: Opplysning<FritekstSvar>
}

export interface NaeringsinntektAvdoed {
    naeringsinntektPrAarFoerDoedsfall?: Opplysning<FritekstSvar>
    naeringsinntektVedDoedsfall?: Opplysning<EnumSvar<JaNeiVetIkke>>
}

export interface ArbeidOgUtdanning {
    dinSituasjon: Opplysning<EnumSvar<JobbStatusType>[]>
    arbeidsforhold?: Opplysning<Arbeidstaker[]>
    selvstendigENK?: Opplysning<SelvstendigNaeringsdrivende[]>
    selvstendigAS?: Opplysning<SelvstendigNaeringsdrivende[]>
    etablererVirksomhet?: Opplysning<EtablererVirksomhet>
    tilbud?: Opplysning<TilbudOmJobb>
    arbeidssoeker?: Opplysning<Arbeidssoeker>
    utdanning?: Opplysning<Utdanning>
    annenSituasjon?: Opplysning<AnnenSituasjon>
}

export interface InntektOgPensjon {
    loennsinntekt?: Opplysning<Loennsinntekt>
    naeringsinntekt?: Opplysning<NaeringsinntektGjenlevende>
    pensjonEllerUfoere?: PensjonEllerUfoere
    annenInntekt?: AnnenInntekt
    ytelserNAV: YtelserNav
    ytelserAndre: YtelserAndre
}

export interface Loennsinntekt {
    arbeidsinntektAaretFoer: Opplysning<FritekstSvar>
    arbeidsinntektIAar: {
        tilDoedsfall: Opplysning<FritekstSvar>
        etterDoedsfall: Opplysning<FritekstSvar>
    }
    endringAvInntekt: EndringAvInntekt
}

export interface NaeringsinntektGjenlevende {
    arbeidsinntektAaretFoer: Opplysning<FritekstSvar>
    arbeidsinntektIAar: {
        tilDoedsfall: Opplysning<FritekstSvar>
        etterDoedsfall: Opplysning<FritekstSvar>
    }
    endringAvInntekt: EndringAvInntekt
}

export interface PensjonEllerUfoere {
    pensjonstype: Opplysning<EnumSvar<PensjonEllerTrygdType>[]>
    tjenestepensjonsordning?: {
        type: Opplysning<EnumSvar<PensjonsYtelseType>>
        utbetaler: Opplysning<FritekstSvar>
    }
    utland: {
        svar: Opplysning<EnumSvar<JaNeiVetIkke>>
        type?: Opplysning<FritekstSvar>
        land?: Opplysning<FritekstSvar>
        beloepMedValuta?: Opplysning<FritekstSvar>
    }
}

export interface AnnenInntekt {
    annenInntektEllerUtbetaling: Opplysning<any>
    beloep?: Opplysning<FritekstSvar>
}

export interface YtelserNav {
    soektOmYtelse: Opplysning<EnumSvar<JaNeiVetIkke>>
    soektYtelse?: Opplysning<EnumSvar<SoekbareYtelserNAVType>[]>
}

export interface YtelserAndre {
    soektOmYtelse: Opplysning<EnumSvar<JaNeiVetIkke>>
    soektYtelse?: Opplysning<EnumSvar<SoekbareYtelserAndreType>[]>
    pensjonsordning?: Opplysning<FritekstSvar>
}

export interface EndringAvInntekt {
    fremtidigEndringAvInntekt: Opplysning<EnumSvar<JaNeiVetIkke>>
    grunn?: Opplysning<EnumSvar<EndringAvInntektGrunnType>>
    annenGrunn?: Opplysning<FritekstSvar>
}

export interface EtablererVirksomhet {
    virksomheten: Opplysning<FritekstSvar>
    orgnr: Opplysning<FritekstSvar>
    forretningsplan: Opplysning<EnumSvar<JaNeiVetIkke>>
    samarbeidMedNav?: Opplysning<EnumSvar<JaNeiVetIkke>>
}

export interface TilbudOmJobb {
    nyttArbeidssted: Opplysning<FritekstSvar>
    ansettelsesdato: Opplysning<DatoSvar>
    ansettelsesforhold: Opplysning<EnumSvar<StillingType>>
    arbeidsmengde: Opplysning<FritekstSvar>
    harSluttdato?: Opplysning<EnumSvar<JaNeiVetIkke>>
    sluttdato?: Opplysning<DatoSvar>
}

export interface Arbeidssoeker {
    registrertArbeidssoeker: Opplysning<EnumSvar<JaNeiVetIkke>>
    aktivitetsplan?: Opplysning<EnumSvar<JaNeiVetIkke>>
}

// TODO: naavaerende utdanning + tidligere

export interface Utdanning {
    studiested: Opplysning<FritekstSvar>
    studie: Opplysning<FritekstSvar>
    studieform: Opplysning<EnumSvar<StudieformType>>
    studieprosent?: Opplysning<FritekstSvar>
    startDato: Opplysning<DatoSvar>
    sluttDato: Opplysning<DatoSvar>
    godkjentUtdanning: Opplysning<EnumSvar<JaNeiVetIkke>>
}

export enum HoeyesteUtdanning {
    GRUNNSKOLE = 'GRUNNSKOLE',
    VIDEREGAAENDE = 'VIDEREGAAENDE',
    FAGBREV = 'FAGBREV',
    UNIVERSITET_OPPTIL_4_AAR = 'UNIVERSITET_OPPTIL_4_AAR',
    UNIVERSITET_OVER_4_AAR = 'UNIVERSITET_OVER_4_AAR',
    INGEN = 'INGEN',
    ANNEN = 'ANNEN',
}

export type EndretInntektBegrunnelse = FritekstSvar

export interface SelvstendigNaeringsdrivende {
    firmanavn: Opplysning<FritekstSvar>
    orgnr: Opplysning<FritekstSvar>
    arbeidsmengde: Opplysning<FritekstSvar>
    endretArbeidssituasjon: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Opplysning<EndretInntektBegrunnelse> | undefined>
}

export interface Arbeidstaker {
    arbeidsgiver: Opplysning<FritekstSvar>
    arbeidsmengde: Opplysning<FritekstSvar>
    ansettelsesforhold: Opplysning<EnumSvar<StillingType>>
    harSluttdato?: Opplysning<EnumSvar<JaNeiVetIkke>>
    sluttdato?: Opplysning<DatoSvar>
    endretArbeidssituasjon: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Opplysning<EndretInntektBegrunnelse> | undefined>
    sagtOppEllerRedusert: Opplysning<EnumSvar<SagtOppEllerRedusertType>>
}

export interface AnnenSituasjon {
    beskrivelse: Opplysning<EnumSvar<IngenJobbType>>
    annet?: Opplysning<FritekstSvar>
}

export enum Ytelser {
    DAGPENGER = 'DAGPENGER',
    SYKEPENGER = 'SYKEPENGER',
    PLEIEPENGER = 'PLEIEPENGER',
    SVANGERSKAPSPENGER = 'SVANGERSKAPSPENGER',
    FORELDREPENGER = 'FORELDREPENGER',
    ARBEIDSAVKLARINGSPENGER = 'ARBEIDSAVKLARINGSPENGER',
    KVALIFISERINGSSTOENAD = 'KVALIFISERINGSSTOENAD',
    KOMMUNAL_OMSORGSSTONAD = 'KOMMUNAL_OMSORGSSTONAD',
    FOSTERHJEMSGODTGJOERING = 'FOSTERHJEMSGODTGJOERING',
    OMSORGSPENGER = 'OMSORGSPENGER',
    OPPLAERINGSPENGER = 'OPPLAERINGSPENGER',
}

export type Pensjonsordning = FritekstSvar

export interface AndreYtelser {
    kravOmAnnenStonad: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Opplysning<EnumSvar<Ytelser>> | undefined>
    annenPensjon: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Opplysning<Pensjonsordning> | undefined>
    pensjonUtland: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, PensjonUtland | undefined>
}

export interface PensjonUtland {
    pensjonsType?: Opplysning<FritekstSvar>
    land?: Opplysning<FritekstSvar>
    bruttobeloepPrAar?: Opplysning<FritekstSvar>
}

export interface OppholdUtland {
    land: Opplysning<FritekstSvar>
}

export enum Stoenader {
    BARNETILSYN = 'BARNETILSYN',
    SKOLEPENGER = 'SKOLEPENGER',
    TILLEGGSSTOENAD_BARNEPASS = 'TILLEGGSSTOENAD_BARNEPASS',
    TILLEGGSSTOENAD_UTDANNING = 'TILLEGGSSTOENAD_UTDANNING',
}

export enum IngenJobbType {
    HJEMMEARBEIDEND = 'HJEMMEARBEIDENDE',
    OMSORG_BARN = 'OMSORG_BARN',
    OMSORG_NAERSTAAENDE = 'OMSORG_NAERSTAAENDE',
    FRIVILLIG_ARBEID = 'FRIVILLIG_ARBEID',
    SYK = 'SYK',
    ANNET = 'ANNET',
}

export enum EndringAvInntektGrunnType {
    OEKT_STILLINGSPROSENT = 'OEKT_STILLINGSPROSENT',
    REDUSERT_STILLINGSPROSENT = 'REDUSERT_STILLINGSPROSENT',
    PERMISJON_UTEN_LOENN = 'PERMISJON_UTEN_LOENN',
    LOENNSOEKNING = 'LOENNSOEKNING',
    ARBEIDSLEDIG = 'ARBEIDSLEDIG',
    SESONGARBEID = 'SESONGARBEID',
    BYTTE_AV_JOBB = 'BYTTE_AV_JOBB',
    ANNEN_GRUNN = 'ANNEN_GRUNN',
}

export enum PensjonsYtelseType {
    AVTALEFESTET_PENSJON_OFFENTLIG = 'AVTALEFESTET_PENSJON_OFFENTLIG',
    AVTALEFESTET_PENSJON_PRIVAT = 'AVTALEFESTET_PENSJON_PRIVAT',
    SAERALDERSPENSJON = 'SAERALDERSPENSJON',
    UFOEREPENSJON = 'UFOEREPENSJON',
    ALDERSPENSJON = 'ALDERSPENSJON',
}

export enum PensjonEllerTrygdType {
    TJENESTEPENSJONSORDNING = 'TJENESTEPENSJONSORDNING',
    UFOEREPENSJON_FRA_NAV = 'UFOEREPENSJON_FRA_NAV',
    ALDERSPENSJON_FRA_NAV = 'ALDERSPENSJON_FRA_NAV',
}

export enum InntektEllerUtbetalingType {
    DAGSPENGER = 'DAGSPENGER',
    SYKEPENGER = 'SYKEPENGER',
    PLEIEPENGER = 'PLEIEPENGER',
    SVANGERSKAPSPENGER = 'SVANGERSKAPSPENGER',
    FORELDREPENGER = 'FORELDREPENGER',
    ARBEIDSAVKLARINGSPENGER = 'ARBEIDSAVKLARINGSPENGER',
    KVALIFISERINGSSTOENAD = 'KVALIFISERINGSSTOENAD',
    KOMMUNAL_OMSORGSSTOENAD = 'KOMMUNAL_OMSORGSSTOENAD',
    FOSTERHJEMSGODTGJOERING = 'FOSTERHJEMSGODTGJOERING',
    OMSORGSPENGER = 'OMSORGSPENGER',
    OPPLAERINGSPENGER = 'OPPLAERINGSPENGER',
    ALDERSPENSJON = 'ALDERSPENSJON',
    ANNEN = 'ANNEN'
}

export enum SoekbareYtelserAndreType {
    AVTALEFESTET_PENSJON_OFFENTLIG = 'AVTALEFESTET_PENSJON_OFFENTLIG',
    AVTALEFESTET_PENSJON_PRIVAT = 'AVTALEFESTET_PENSJON_PRIVAT',
    SAERALDERSPENSJON = 'SAERALDERSPENSJON',
    UFOEREPENSJON = 'UFOEREPENSJON',
    ALDERSPENSJON = 'ALDERSPENSJON',
}

export enum SoekbareYtelserNAVType {
    DAGSPENGER = 'DAGSPENGER',
    SYKEPENGER = 'SYKEPENGER',
    PLEIEPENGER = 'PLEIEPENGER',
    SVANGERSKAPSPENGER = 'SVANGERSKAPSPENGER',
    FORELDREPENGER = 'FORELDREPENGER',
    ARBEIDSAVKLARINGSPENGER = 'ARBEIDSAVKLARINGSPENGER',
    KVALIFISERINGSSTOENAD = 'KVALIFISERINGSSTOENAD',
    KOMMUNAL_OMSORGSSTOENAD = 'KOMMUNAL_OMSORGSSTOENAD',
    FOSTERHJEMSGODTGJOERING = 'FOSTERHJEMSGODTGJOERING',
    OMSORGSPENGER = 'OMSORGSPENGER',
    OPPLAERINGSPENGER = 'OPPLAERINGSPENGER',
    UFOEREPENSJON = 'UFOEREPENSJON',
    ALDERSPENSJON = 'ALDERSPENSJON',
}

export enum ArbeidsmengdeType {
    PROSENT = 'PROSENT',
    TIMER = 'TIMER',
}
