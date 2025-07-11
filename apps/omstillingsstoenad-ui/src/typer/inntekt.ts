import { IValgfrittSvar } from './arbeidsforhold'
import { IValg } from './Spoersmaal'

export interface IInntekt {
    // TODO: FELTER FOR DEN NYE DATASTASTRUKTUREN
    skalGaaAvMedAlderspensjon?: ISkalGaaAvMedAlderspensjon
    // TODO: disse er veldig like, må se på noen felles interfacer for de
    inntektFremTilDoedsfallet?: IInntektFremTilDoedsfallet
    forventetInntektIAar?: IForventetInntektIAar
    forventetInntektTilNesteAar?: IForventetInntektTilNesteAar
    // TODO: FELTER FOR DEN GAMMLE DATASTRUKTUREN
    inntektstyper?: InntektsTyper[]
    loennsinntekt?: ILoennsinntekt
    naeringsinntekt?: ILoennsinntekt
    pensjonEllerUfoere?: IPensjonEllerUfoere
    inntektViaYtelserFraNAV?: IInntektViaYtelserFraNAV
    ingenInntekt?: IIngenInntekt
    ytelserNAV?: IYtelserNAV
    ytelserAndre?: IYtelserAndre
    erValidert?: boolean
}

// TODO: FELTER FOR DEN NYE DATASTASTRUKTUREN

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

// TODO: FELTER FOR DEN GAMMLE DATASTRUKTUREN
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

export interface IIngenInntekt {
    svar?: IValg
    beloep?: string
    beskrivelse?: string
}

export interface ILoennsinntekt {
    norgeEllerUtland: NorgeOgUtland[]
    norge?: IInntekter
    utland?: IInntekter
    forventerEndringAvInntekt: IForventerEndringAvInntekt
}

export interface IInntekter {
    inntektAaretFoerDoedsfall?: string
    inntektIFjor?: {
        tilDoedsfall?: string
        aarsinntekt?: string
    }
    inntektIAar?: {
        tilDoedsfall?: string
        aarsinntekt?: string
    }
    inntektNesteAar?: {
        aarsinntekt?: string
    }
    jevntOpptjentNaeringsinntekt?: {
        svar?: IValg
        beskrivelse?: string
    }
}

export interface IPensjonEllerUfoere {
    pensjonstype: PensjonEllerTrygd[]
    tjenestepensjonsordning?: {
        type: PensjonsYtelse[]
        afpOffentlig?: {
            innvilget: Date
            beloep: string
        }
        utbetaler: string
    }
    utland?: {
        type?: string
        land?: string
        beloep?: string
        valuta?: string
    }
}

export interface IInntektViaYtelserFraNAV {
    ytelser: InntektEllerUtbetaling[]
    aktivitetsplan: IValgfrittSvar
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
