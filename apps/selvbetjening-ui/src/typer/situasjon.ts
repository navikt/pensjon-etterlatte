import { IValg } from "./Spoersmaal";
import { IArbeidsforhold, ITidligereArbeidsforhold } from "./arbeidsforhold";
import { IAndreYtelser } from "./ytelser";

export interface IUtdanning {
    hoyesteFullfoerteUtdanning?: string;
    antallAarUniversitetHoyskole?: string;
}

export enum Utdanning {
    grunnskole = "utdanning.grunnskole",
    videregående = "utdanning.videregående",
    universitetHoeyskole = "utdanning.universitetHoeyskole",
    harIngenUtdanning = "utdanning.harIngenUtdanning"
}

export enum JobbStatus {
    arbeidstaker = "jobbStatus.arbeidstaker",
    arbeidsledig = "jobbStatus.arbeidsledig",
    underUtdanning = "jobbStatus.underUtdanning"
}

export interface ISituasjon {
    status?: JobbStatus;
    selvstendigNaeringsdrivende?: IValg;
    utdanning?: IUtdanning;
    arbeidsforhold?: IArbeidsforhold;
    tidligereArbeidsforhold?: ITidligereArbeidsforhold[];
    andreYtelser?: IAndreYtelser;
}