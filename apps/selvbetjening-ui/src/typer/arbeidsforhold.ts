import { IValg } from "./Spoersmaal";

export enum StillingType {
    fast = "stillingType.fast",
    midlertidig = "stillingType.midlertidig",
    sesongarbeid = "stillingType.sesongarbeid"
}

export interface IArbeidsforhold {
    arbeidsgiver?: string;
    stilling?: string;
    ansettelsesforhold?: StillingType; // låse valg til type?
    stillingsprosent?: number;
    forventerEndretInntekt?: {
        svar?: IValg;
        beskrivelse?: string;
    }
    inntekt?: {
        bruttoArbeidsinntektPrMd?: string;
        personinntektFraNaeringPrAr?: string;
    };
}

export interface ISelvstendigNaeringsdrivende {
    beskrivelse?: string;
    startDato?: Date;
    orgnr?: string;
    type?: string;
    forventerEndretInntekt?: {
        svar?: IValg;
        beskrivelse?: string;
    }
}

export interface ITidligereArbeidsforhold {
    beskrivelse?: string;
    fraDato?: Date;
    tilDato?: Date;
}
