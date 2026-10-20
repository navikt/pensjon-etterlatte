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

export enum SkalGaaAvMedAlderspensjonValg {
    JA = 'radiobuttons.ja',
    NEI = 'radiobuttons.nei',
    VET_IKKE = 'radiobuttons.vetIkke',
    TAR_ALLEREDE_UT_ALDERSPENSJON = 'radiobuttons.tarAlleredeUtAlderspensjon',
}

export interface ISkalGaaAvMedAlderspensjon {
    valg?: SkalGaaAvMedAlderspensjonValg
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
