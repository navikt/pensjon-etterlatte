import { IValg } from "./Spoersmaal";

export enum StillingType {
    fast = "stillingType.fast",
    midlertidig = "stillingType.midlertidig",
    sesongarbeid = "stillingType.sesongarbeid"
}

export interface IArbeidsforhold {
    arbeidsgiver?: string;
    stilling?: string;
    startDato?: Date;
    sluttDato?: Date;
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
    // que pasa, se tegninger... her er det noe muffens
    beskrivelse?: string;
    startDato?: Date;
    type?: string;
    endringIfmDoedsfall?: string;
}

export interface ITidligereArbeidsforhold {
    beskrivelse?: string;
    fraDato?: Date;
    tilDato?: Date;
}
