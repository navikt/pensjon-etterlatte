import { IValg } from './Spoersmaal'

export interface IInntekt {
    skalGaaAvMedAlderspensjon?: ISkalGaaAvMedAlderspensjon
    inntektFremTilDoedsfallet?: IInntektFremTilDoedsfallet
    forventetInntektIAar?: IForventetInntektIAar
    forventetInntektTilNesteAar?: IForventetInntektTilNesteAar
    ytelserNAV?: IYtelserNAV
    ytelserAndre?: IYtelserAndre
    erValidert?: boolean
}

export interface ISkalGaaAvMedAlderspensjon {
    valg?: IValg
    datoForAaGaaAvMedAlderspensjon?: string
}

export interface IInntektFremTilDoedsfallet {
    arbeidsinntekt?: string
    naeringsinntekt?: {
        inntekt?: string
        erNaeringsinntektOpptjentJevnt?: {
            valg?: IValg
            beskrivelse?: string
        }
    }
    afpInntekt?: {
        inntekt?: string
        tjenesteordning?: string
    }
    inntektFraUtland?: string
    andreInntekter?: {
        valg?: IValg
        inntekt?: string
        beskrivelse?: string
    }
}

export interface IForventetInntektIAar {
    arbeidsinntekt?: string
    naeringsinntekt?: {
        inntekt?: string
        erNaeringsinntektOpptjentJevnt?: {
            valg?: IValg
            beskrivelse?: string
        }
    }
    afpInntekt?: {
        inntekt?: string
        tjenesteordning?: string
    }
    inntektFraUtland?: string
    andreInntekter?: {
        valg?: IValg
        inntekt?: string
        beskrivelse?: string
    }
    noeSomKanPaavirkeInntekten?: {
        valg?: IValg
        grunnTilPaavirkelseAvInntekt: GrunnTilPaavirkelseAvInntekt
        beskrivelse?: string
    }
}

export interface IForventetInntektTilNesteAar {
    arbeidsinntekt?: string
    naeringsinntekt?: {
        inntekt?: string
        erNaeringsinntektOpptjentJevnt?: {
            valg?: IValg
            beskrivelse?: string
        }
    }
    afpInntekt?: {
        inntekt?: string
        tjenesteordning?: string
    }
    inntektFraUtland?: string
    andreInntekter?: {
        valg?: IValg
        inntekt?: string
        beskrivelse?: string
    }
    noeSomKanPaavirkeInntekten?: {
        valg?: IValg
        grunnTilPaavirkelseAvInntekt: GrunnTilPaavirkelseAvInntekt
        beskrivelse?: string
    }
}

export enum GrunnTilPaavirkelseAvInntekt {
    oektStillingsprosent = 'grunnTilPaavirkelseAvInntekt.oektStillingsprosent',
    redusertStillingsprosent = 'grunnTilPaavirkelseAvInntekt.redusertStillingsprosent',
    permisjonUtenLoenn = 'grunnTilPaavirkelseAvInntekt.permisjonUtenLoenn',
    loennsoekning = 'grunnTilPaavirkelseAvInntekt.loennsoekning',
    arbeidsledig = 'grunnTilPaavirkelseAvInntekt.arbeidsledig',
    sesongarbeid = 'grunnTilPaavirkelseAvInntekt.sesongarbeid',
    bytteAvJobb = 'grunnTilPaavirkelseAvInntekt.bytteAvJobb',
    annenGrunn = 'grunnTilPaavirkelseAvInntekt.annenGrunn',
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

export enum InntektsTyper {
    loenn = 'inntekt.loenn',
    naering = 'inntekt.naering',
    pensjonEllerUfoere = 'inntekt.pensjonEllerUfoere',
    ytelser = 'inntekt.ytelser',
    annen = 'inntekt.annen',
}

export enum NorgeOgUtland {
    norge = 'inntekt.norge',
    utland = 'inntekt.utland',
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
    ufoeretrygd = 'soekbarYtelse.ufoeretrygd',
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
    pensjonFraUtlandet = 'soekbarYtelse.pensjonFraUtlandet',
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
