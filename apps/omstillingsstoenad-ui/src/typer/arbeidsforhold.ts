import { IValg } from './Spoersmaal'

export enum StillingType {
    fast = 'stillingType.fast',
    midlertidig = 'stillingType.midlertidig',
    tilkallingsvikar = 'stillingType.tilkallingsvikar',
}

export interface IArbeidsforhold {
    arbeidsgiver?: string
    arbeidsmengde?: IArbeidsmengde
    stilling?: string // Bort?
    ansettelsesforhold?: StillingType
    midlertidig?: {
        svar?: IValg
        sluttdatoVelger?: Date
    }
    forventerEndretArbeidssituasjon?: {
        svar?: IValg
        beskrivelse?: string
    }
    //sagtOppEllerRedusert: {
    //    svar?: SagtOppEllerRedusert
    //}
}

interface IArbeidsmengde {
    svar: string
    type?: Arbeidsmengde
}

export interface ISelvstendigNaeringsdrivende {
    beskrivelse?: string
    orgnr?: string
    arbeidsmengde?: IArbeidsmengde
    forventerEndretArbeidssituasjon?: {
        svar?: IValg
        beskrivelse?: string
    }
}

export interface IEtablererVirksomhet {
    hvaHeterVirksomheten?: string
    orgnr?: string
    manglerOrgnr?: string[]
    forretningsplan?: {
        svar?: IValg
        samarbeidMedNAV?: IValgfrittSvar
    }
}

export interface ITilbudOmJobb {
    arbeidssted?: string
    ansettelsesdato?: Date
    ansettelsesforhold?: StillingType
    arbeidsmengde?: IArbeidsmengde
    midlertidig?: {
        svar?: IValg
        sluttdatoVelger?: Date
    }
    aktivitetsplan: IValgfrittSvar
}

export interface IArbeidssoeker {
    svar?: IValg
    aktivitetsplan: IValgfrittSvar
}

export interface IAnnenSituasjon {
    beskrivelse?: IngenJobb
    annet?: {
        beskrivelse?: string
    }
}

export interface IValgfrittSvar {
    svar?: IValg
}

export enum IngenJobb {
    hjemmearbeidende = 'merOmSituasjonenDin.ingenJobb.hjemmearbeidende',
    omsorgBarn = 'merOmSituasjonenDin.ingenJobb.omsorgBarn',
    omsorgNaerstaaende = 'merOmSituasjonenDin.ingenJobb.omsorgNaerstaaende',
    frivilligArbeid = 'merOmSituasjonenDin.ingenJobb.frivilligArbeid',
    syk = 'merOmSituasjonenDin.ingenJobb.syk',
    annet = 'merOmSituasjonenDin.ingenJobb.annet',
}

export enum ForventerEndretInntektType {
    oektStillingsprosent = 'merOmSituasjonenDin.forventerEndretInntektType.oektStillingsprosent',
    redusertStillingsprosent = 'merOmSituasjonenDin.forventerEndretInntektType.redusertStillingsprosent',
    permisjonUtenLoenn = 'merOmSituasjonenDin.forventerEndretInntektType.permisjonUtenLoenn',
    loennsOekning = 'merOmSituasjonenDin.forventerEndretInntektType.loennsOekning',
    arbeidsledig = 'merOmSituasjonenDin.forventerEndretInntektType.arbeidsledig',
    sesongarbeid = 'merOmSituasjonenDin.forventerEndretInntektType.sesongarbeid',
    bytteAvJobb = 'merOmSituasjonenDin.forventerEndretInntektType.bytteAvJobb',
    annet = 'merOmSituasjonenDin.forventerEndretInntektType.annet',
}

export enum Arbeidsmengde {
    prosent = 'arbeidsmengde.prosent',
    timer = 'arbeidsmengde.timer',
}

export enum SagtOppEllerRedusert {
    oppsagt = 'sagtOppEllerRedusert.oppsagt',
    redusert = 'sagtOppEllerRedusert.redusert',
    nei = 'radiobuttons.nei',
}
