import { IValg } from "./Spoersmaal";

export enum StillingType {
    Fast = "Fast",
    Midlertidig = "Midlertidig",
    Sesongarbeid = "Sesongarbeid"
}

export interface IArbeidsforhold {
    stillingEllerYrke?: string;
    startDato?: Date;
    sluttDato?: Date;
    ansettelsesforhold?: StillingType; // låse valg til type?
    heltidDeltid?: string;
    stillingsprosent?: number;
    forventerEndretInntekt?: IValg;
    arbeidsgiver?: {
        navn?: string;
        adresse?: string;
    };
    inntekt?: {
        bruttoArbeidsinntektPrMd?: string;
        personinntektFraNaeringPrAr?: string;
    };
}

export interface ITidligereArbeidsforhold {
    beskrivelse?: string;
    fraDato?: Date;
    tilDato?: Date;
}
