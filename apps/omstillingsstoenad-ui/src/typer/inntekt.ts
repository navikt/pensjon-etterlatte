import { IValg } from './Spoersmaal'

export interface IInntekt {
    inntektstyper?: InntektsTyper[]
    loennsinntekt?: ILoennsinntekt
    ytelserNAV?: IYtelserNAV
    ytelserAndre?: IYtelserAndre
    forventerEndringAvInntekt?: IForventerEndringAvInntekt
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

interface IForventerEndringAvInntekt {
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
}

export enum InntektsTyper {
    loenn = "inntekt.loenn",
    naering = "inntekt.naering",
    pensjonEllerUfoere = "inntekt.pensjonEllerUfoere",
    annen = "inntekt.annen"
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