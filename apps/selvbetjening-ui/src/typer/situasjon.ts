import { IValg } from "./Spoersmaal";
import { IArbeidsforhold, ITidligereArbeidsforhold } from "./arbeidsforhold";
import { IAndreYtelser } from "./ytelser";

export interface IUtdanning {
    hoyesteFullfoerteUtdanning?: string;
    antallAarUniversitetHoyskole?: string;
}

export enum JobbStatus {
    Arbeidstaker = "Arbeidstaker",
    Arbeidsledig = "Arbeidsledig",
    UnderUtdanning = "UnderUtdanning"
}

export interface ISituasjon {
    status?: JobbStatus;
    selvstendigNaeringsdrivende?: IValg;
    utdanning?: IUtdanning;
    arbeidsforhold?: IArbeidsforhold;
    tidligereArbeidsforhold?: ITidligereArbeidsforhold[];
    andreYtelser?: IAndreYtelser;
}