import { IArbeidsforhold, ISelvstendigNaeringsdrivende } from "./arbeidsforhold";
import { IAndreYtelser } from "./ytelser";

export interface IUtdanning {
    naavaerendeUtdanning?: {
        navn?: string;
        startDato?: Date;
        sluttDato?: Date;
    };
    hoyesteFullfoerteUtdanning?: string;
    annenUtdanning?: string;
}

export enum Utdanning {
    grunnskole = "utdanning.grunnskole",
    videregående = "utdanning.videregående",
    fagbrev = "utdanning.fagbrev",
    bachelorgrad = "utdanning.bachelorgrad",
    mastergrad = "utdanning.mastergrad",
    ingen = "utdanning.ingen",
    annen = "utdanning.annen",
}

export enum JobbStatus {
    arbeidstaker = "jobbStatus.arbeidstaker",
    selvstendig = "jobbStatus.selvstendig",
    underUtdanning = "jobbStatus.underUtdanning",
    ingen = "jobbStatus.ingen",
}

export interface ISituasjon {
    jobbStatus?: JobbStatus;
    ingenJobbBeskrivelse?: string;
    utdanning?: IUtdanning;
    selvstendig?: ISelvstendigNaeringsdrivende[];
    arbeidsforhold?: IArbeidsforhold[];
    andreYtelser?: IAndreYtelser;
}
