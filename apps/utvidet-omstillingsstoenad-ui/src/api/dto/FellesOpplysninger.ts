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

export enum SkalGaaAvMedAlderspensjonValgSvar {
    JA = 'JA',
    NEI = 'NEI',
    VET_IKKE = 'VET_IKKE',
    TAR_ALLEREDE_UT_ALDERSPENSJON = 'TAR_ALLEREDE_UT_ALDERSPENSJON',
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
}

export interface Kontaktinfo {
    telefonnummer: Opplysning<FritekstSvar>
}

export enum BankkontoType {
    NORSK = 'NORSK',
    UTENLANDSK = 'UTENLANDSK',
}

export enum ForholdTilAvdoedeType {
    GIFT = 'GIFT',
    SEPARERT = 'SEPARERT',
    SAMBOER = 'SAMBOER',
    SKILT = 'SKILT',
}

export enum OppholdUtlandType {
    BODD = 'BODD',
    ARBEIDET = 'ARBEIDET',
}

export enum JobbStatusType {
    ARBEIDSTAKER = 'ARBEIDSTAKER',
    SELVSTENDIG = 'SELVSTENDIG',
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
    ENKE = 'ENKE',
    ENSLIG = 'ENSLIG',
    EKTESKAP = 'EKTESKAP',
    SAMBOERSKAP = 'SAMBOERSKAP',
}

export enum StudieformType {
    HELTID = 'HELTID',
    DELTID = 'DELTID',
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
    mottokBidrag?: BetingetOpplysning<EnumSvar<JaNeiVetIkke>, Opplysning<FritekstSvar> | undefined>
}

export interface Utenlandsopphold {
    land: Opplysning<FritekstSvar>
    fraDato?: Opplysning<DatoSvar>
    tilDato?: Opplysning<DatoSvar>
    oppholdsType: Opplysning<EnumSvar<OppholdUtlandType>[]>
    medlemFolketrygd: Opplysning<EnumSvar<JaNeiVetIkke>>
    pensjonsutbetaling?: Opplysning<FritekstSvar>
}

export interface ArbeidOgUtdanning {
    dinSituasjon: Opplysning<EnumSvar<JobbStatusType>[]>
    arbeidsforhold?: Opplysning<Arbeidstaker[]>
    selvstendig?: Opplysning<SelvstendigNaeringsdrivende[]>
    etablererVirksomhet?: Opplysning<EtablererVirksomhet>
    tilbud?: Opplysning<TilbudOmJobb>
    arbeidssoeker?: Opplysning<Arbeidssoeker>
    utdanning?: Opplysning<Utdanning>
    annenSituasjon?: Opplysning<AnnenSituasjon>
}

export interface InntektOgPensjon {
    skalGaaAvMedAlderspensjon?: SkalGaaAvMedAlderspensjon
    inntektFremTilDoedsfallet?: Opplysning<InntektFremTilDoedsfallet>
    forventetInntektIAar?: Opplysning<ForventetInntektIAar>
    forventetInntektTilNesteAar?: Opplysning<ForventetInntektTilNesteAar>
    ytelserNAV: YtelserNav
    ytelserAndre: YtelserAndre
}

export interface SkalGaaAvMedAlderspensjon {
    valg?: Opplysning<EnumSvar<SkalGaaAvMedAlderspensjonValgSvar>>
    datoForAaGaaAvMedAlderspensjon?: Opplysning<DatoSvar>
}

export interface InntektFremTilDoedsfallet {
    arbeidsinntekt?: Opplysning<FritekstSvar>
    naeringsinntekt?: {
        inntekt?: Opplysning<FritekstSvar>
        erNaeringsinntektOpptjentJevnt?: {
            valg?: Opplysning<EnumSvar<JaNeiVetIkke>>
            beskrivelse?: Opplysning<FritekstSvar>
        }
    }
    afpInntekt?: {
        inntekt?: Opplysning<FritekstSvar>
        tjenesteordning?: Opplysning<FritekstSvar>
    }
    inntektFraUtland?: Opplysning<FritekstSvar>
    andreInntekter?: {
        valg?: Opplysning<EnumSvar<JaNeiVetIkke>>
        inntekt?: Opplysning<FritekstSvar>
        beskrivelse?: Opplysning<FritekstSvar>
    }
}

export interface ForventetInntektIAar {
    arbeidsinntekt?: Opplysning<FritekstSvar>
    naeringsinntekt?: {
        inntekt?: Opplysning<FritekstSvar>
        erNaeringsinntektOpptjentJevnt?: {
            valg?: Opplysning<EnumSvar<JaNeiVetIkke>>
            beskrivelse?: Opplysning<FritekstSvar>
        }
    }
    afpInntekt?: {
        inntekt?: Opplysning<FritekstSvar>
        tjenesteordning?: Opplysning<FritekstSvar>
    }
    inntektFraUtland?: Opplysning<FritekstSvar>
    andreInntekter?: {
        valg?: Opplysning<EnumSvar<JaNeiVetIkke>>
        inntekt?: Opplysning<FritekstSvar>
        beskrivelse?: Opplysning<FritekstSvar>
    }
    noeSomKanPaavirkeInntekten?: {
        valg?: Opplysning<EnumSvar<JaNeiVetIkke>>
        grunnTilPaavirkelseAvInntekt?: Opplysning<EnumSvar<EndringAvInntektGrunnType>>
        beskrivelse?: Opplysning<FritekstSvar>
    }
}

export interface ForventetInntektTilNesteAar {
    arbeidsinntekt?: Opplysning<FritekstSvar>
    naeringsinntekt?: {
        inntekt?: Opplysning<FritekstSvar>
        erNaeringsinntektOpptjentJevnt?: {
            valg?: Opplysning<EnumSvar<JaNeiVetIkke>>
            beskrivelse?: Opplysning<FritekstSvar>
        }
    }
    afpInntekt?: {
        inntekt?: Opplysning<FritekstSvar>
        tjenesteordning?: Opplysning<FritekstSvar>
    }
    inntektFraUtland?: Opplysning<FritekstSvar>
    andreInntekter?: {
        valg?: Opplysning<EnumSvar<JaNeiVetIkke>>
        inntekt?: Opplysning<FritekstSvar>
        beskrivelse?: Opplysning<FritekstSvar>
    }
    noeSomKanPaavirkeInntekten?: {
        valg?: Opplysning<EnumSvar<JaNeiVetIkke>>
        grunnTilPaavirkelseAvInntekt?: Opplysning<EnumSvar<EndringAvInntektGrunnType>>
        beskrivelse?: Opplysning<FritekstSvar>
    }
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
    aktivitetsplan: Opplysning<EnumSvar<JaNeiVetIkke>>
}

export interface Arbeidssoeker {
    registrertArbeidssoeker: Opplysning<EnumSvar<JaNeiVetIkke>>
    aktivitetsplan?: Opplysning<EnumSvar<JaNeiVetIkke>>
}

export interface Utdanning {
    studiested: Opplysning<FritekstSvar>
    studie: Opplysning<FritekstSvar>
    studieform: Opplysning<EnumSvar<StudieformType>>
    studieprosent?: Opplysning<FritekstSvar>
    startDato: Opplysning<DatoSvar>
    sluttDato: Opplysning<DatoSvar>
    godkjentUtdanning: Opplysning<EnumSvar<JaNeiVetIkke>>
    aktivitetsplan: Opplysning<EnumSvar<JaNeiVetIkke>>
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
}

export interface AnnenSituasjon {
    beskrivelse: Opplysning<EnumSvar<IngenJobbType>[]>
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

export interface OppholdUtland {
    bosattLand?: Opplysning<FritekstSvar>
    oppholderSegIUtlandet?: Opplysning<EnumSvar<JaNeiVetIkke>>
    oppholdsland?: Opplysning<FritekstSvar>
    oppholdFra?: Opplysning<DatoSvar>
    oppholdTil?: Opplysning<DatoSvar>
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
    UFOERETRYGD = 'UFOERETRYGD',
    ALDERSPENSJON = 'ALDERSPENSJON',
}
