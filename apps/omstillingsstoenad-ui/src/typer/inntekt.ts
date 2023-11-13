import { IValg } from './Spoersmaal'

export interface IInntekt {
    inntektstyper?: InntektsTyper[]
    loennsinntekt?: ILoennsinntekt
    naeringsinntekt?: INaeringsinntekt
    pensjonEllerUfoere?: IPensjonEllerUfoere
    annenInntekt?: IAnnenInntekt
    ytelserNAV?: IYtelserNAV
    ytelserAndre?: IYtelserAndre
    erValidert?: boolean
}

interface IYtelserNAV {
    svar?: IValg
    soekteYtelser?: SoekbareYtelserNAV[]
}

interface IYtelserAndre {
    svar?: IValg
    soekteYtelser?: SoekbareYtelserAndre[]
    pensjonsordning?: string
}

export interface IForventerEndringAvInntekt {
    svar?: IValg
    grunn?: EndringAvInntektGrunn
    annenGrunn?: string
}

export interface ILoennsinntekt {
    arbeidsinntektAaretFoer?: string
    arbeidsinntektIAar?: {
        tilDoedsfall?: string
        etterDoedsfall?: string
    }
    forventerEndringAvInntekt: IForventerEndringAvInntekt
}

export interface INaeringsinntekt {
    arbeidsinntektAaretFoer?: string
    arbeidsinntektIAar?: {
        tilDoedsfall?: string
        etterDoedsfall?: string
    }
    forventerEndringAvInntekt: IForventerEndringAvInntekt
}

export interface IPensjonEllerUfoere {
    pensjonstype: PensjonEllerTrygd[]
    tjenestepensjonsordning?: {
        type: PensjonsYtelse
        utbetaler: string
    }
    utland: {
        svar: IValg
        type?: string
        land?: string
        beloep?: string
        valuta?: string
    }
}

export interface IAnnenInntekt {
    inntektEllerUtbetaling: InntektEllerUtbetaling[]
    beloep?: string
}

export enum InntektsTyper {
    loenn = "inntekt.loenn",
    naering = "inntekt.naering",
    pensjonEllerUfoere = "inntekt.pensjonEllerUfoere",
    annen = "inntekt.annen"
}

export enum InntektEllerUtbetaling {
    dagspenger = 'soekbarYtelse.dagspenger',
    sykepenger = 'soekbarYtelse.sykepenger',
    pleiepenger = 'soekbarYtelse.pleiepenger',
    svangerskapspenger = 'soekbarYtelse.svangerskapspenger',
    foreldrepenger = 'soekbarYtelse.foreldrepenger',
    arbeidsavklaringspenger = 'soekbarYtelse.arbeidsavklaringspenger',
    kvalifiseringsstoenad = 'soekbarYtelse.kvalifiseringsstoenad',
    kommunalOmsorgsstoenad = 'soekbarYtelse.kommunalOmsorgsstoenad',
    fosterhjemsgodtgjoering = 'soekbarYtelse.fosterhjemsgodtgjoering',
    omsorgspenger = 'soekbarYtelse.omsorgspenger',
    opplaeringspenger = 'soekbarYtelse.opplaeringspenger',
    alderspensjon = 'soekbarYtelse.alderspensjon',
    annen = 'soekbarYtelse.annen'
}

export enum SoekbareYtelserNAV {
    dagspenger = 'soekbarYtelse.dagspenger',
    sykepenger = 'soekbarYtelse.sykepenger',
    pleiepenger = 'soekbarYtelse.pleiepenger',
    svangerskapspenger = 'soekbarYtelse.svangerskapspenger',
    foreldrepenger = 'soekbarYtelse.foreldrepenger',
    arbeidsavklaringspenger = 'soekbarYtelse.arbeidsavklaringspenger',
    kvalifiseringsstoenad = 'soekbarYtelse.kvalifiseringsstoenad',
    kommunalOmsorgsstoenad = 'soekbarYtelse.kommunalOmsorgsstoenad',
    fosterhjemsgodtgjoering = 'soekbarYtelse.fosterhjemsgodtgjoering',
    omsorgspenger = 'soekbarYtelse.omsorgspenger',
    opplaeringspenger = 'soekbarYtelse.opplaeringspenger',
    ufoerepensjon = 'soekbarYtelse.ufoerepensjon',
    alderspensjon = 'soekbarYtelse.alderspensjon',
}

export enum SoekbareYtelserAndre {
    avtalefestetPensjonOffentlig = 'soekbarYtelse.avtalefestetPensjonOffentlig',
    avtalefestetPensjonPrivat = 'soekbarYtelse.avtalefestetPensjonPrivat',
    saeralderpensjon = 'soekbarYtelse.saeralderpensjon',
    ufoerepensjon = 'soekbarYtelse.ufoerepensjon',
    alderspensjon = 'soekbarYtelse.alderspensjon',
}

export enum PensjonsYtelse {
    avtalefestetPensjonPrivat = 'soekbarYtelse.avtalefestetPensjonPrivat',
    avtalefestetPensjonOffentlig = 'soekbarYtelse.avtalefestetPensjonOffentlig',
    ufoerepensjon = 'soekbarYtelse.ufoerepensjon',
    alderspensjon = 'soekbarYtelse.alderspensjon',
    saeralderpensjon = 'soekbarYtelse.saeralderpensjon',
}

export enum PensjonEllerTrygd {
    ufoeretrygdFraNAV = 'soekbarYtelse.ufoeretrygdFraNAV',
    alderspensjonFraNAV = 'soekbarYtelse.alderspensjonFraNAV',
    tjenestepensjonsordning = 'soekbarYtelse.tjenestepensjonsordning',
}

export enum EndringAvInntektGrunn {
    oektStillingsprosent = 'endringAvInntekt.oektStillingsprosent',
    redusertStillingsprosent = 'endringAvInntekt.redusertStillingsprosent',
    permisjonUtenLoenn = 'endringAvInntekt.permisjonUtenLoenn',
    loennsoekning = 'endringAvInntekt.loennsoekning',
    arbeidsledig = 'endringAvInntekt.arbeidsledig',
    sesongarbeid = 'endringAvInntekt.sesongarbeid',
    bytteAvJobb = 'endringAvInntekt.bytteAvJobb',
    annenGrunn = 'endringAvInntekt.annenGrunn',
}