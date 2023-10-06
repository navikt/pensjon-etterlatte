import { IValg } from './Spoersmaal'

export enum StillingType {
    fast = 'stillingType.fast',
    midlertidig = 'stillingType.midlertidig',
    sesongarbeid = 'stillingType.sesongarbeid',
}

export interface IArbeidsforhold {
    arbeidsgiver?: string
    typeArbeidsmengde?: Arbeidsmengde
    arbeidsmengde?: {
        timer?: string
        prosent?: string
    }
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
    sagtOppEllerRedusert: {
        svar?: SagtOppEllerRedusert
    }
}

export interface ISelvstendig {
    as?: ISelvstendigNaeringsdrivende[]
    enk?: ISelvstendigNaeringsdrivende[]
}

export interface ISelvstendigNaeringsdrivende {
    beskrivelse?: string
    orgnr?: string
    typeArbeidsmengde?: Arbeidsmengde
    arbeidsmengde?: {
        timer?: string
        prosent?: string
    }
    forventerEndretArbeidssituasjon?: {
        svar?: IValg
        beskrivelse?: string
    }
}

export interface IEtablererVirksomhet {
    hvaHeterVirksomheten?: string
    orgnr?: string
    forretningsplan?: {
        svar?: IValg
        samarbeidMedNAV?: {
            svar?: IValg
        }
    }
}

export interface ITilbudOmJobb {
    arbeidssted?: string
    ansettelsesforhold?: StillingType
    midlertidig?: {
        svar?: IValg
        sluttdatoVelger?: Date
    }
}

export interface IArbeidssoeker {
    svar?: IValg
    aktivitetsplan: {
        svar?: IValg
    }
}

export interface IAnnenSituasjon {
    beskrivelse?: IngenJobb
    annet?: {
        beskrivelse?: string
    }
}

export enum IngenJobb {
    hjemmearbeidende = 'dinSituasjon.ingenJobb.hjemmearbeidende',
    omsorgBarn = 'dinSituasjon.ingenJobb.omsorgBarn',
    omsorgNaerstaaende = 'dinSituasjon.ingenJobb.omsorgNaerstaaende',
    frivilligArbeid = 'dinSituasjon.ingenJobb.frivilligArbeid',
    syk = 'dinSituasjon.ingenJobb.syk',
    annet = 'dinSituasjon.ingenJobb.annet',
}

export enum ForventerEndretInntektType {
    oektStillingsprosent = 'dinSituasjon.forventerEndretInntektType.oektStillingsprosent',
    redusertStillingsprosent = 'dinSituasjon.forventerEndretInntektType.redusertStillingsprosent',
    permisjonUtenLoenn = 'dinSituasjon.forventerEndretInntektType.permisjonUtenLoenn',
    loennsOekning = 'dinSituasjon.forventerEndretInntektType.loennsOekning',
    arbeidsledig = 'dinSituasjon.forventerEndretInntektType.arbeidsledig',
    sesongarbeid = 'dinSituasjon.forventerEndretInntektType.sesongarbeid',
    bytteAvJobb = 'dinSituasjon.forventerEndretInntektType.bytteAvJobb',
    annet = 'dinSituasjon.forventerEndretInntektType.annet',
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
