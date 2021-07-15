import { IArbeidsforhold, ISelvstendigNaeringsdrivende, ITidligereArbeidsforhold } from "./arbeidsforhold";
import { IAndreYtelser } from "./ytelser";

export interface IUtdanning {
    naavaerendeUtdanning?: {
        navn?: string;
        startDato?: Date;
        sluttDato?: Date;
    }
    hoyesteFullfoerteUtdanning?: string;
    annenUtdanning?: string;
}

export enum Utdanning {
    grunnskole = "utdanning.grunnskole",
    videregående = "utdanning.videregående",
    bachelorgrad = "utdanning.bachelorgrad",
    mastergrad = "utdanning.mastergrad",
    ingen = "utdanning.ingen",
    annen = "utdanning.annen"
}

export enum JobbStatus {
    arbeidstaker = "jobbStatus.arbeidstaker",
    arbeidsledig = "jobbStatus.arbeidsledig",
    underUtdanning = "jobbStatus.underUtdanning",
    ingen = "jobbStatus.ingen"
}

export enum ArbeidsforholdType {
    selvstendig = "arbeidsforholdType.selvstendig",
    arbeidstaker = "arbeidsforholdType.arbeidstaker",
    begge = "arbeidsforholdType.begge"
}

export interface ISituasjon {
    jobbStatus?: JobbStatus;
    beskrivelseIngen?: string;
    arbeidsforholdType?: ArbeidsforholdType;
    utdanning?: IUtdanning;
    selvstendigNaeringsdrivende?: ISelvstendigNaeringsdrivende;
    arbeidsforhold?: IArbeidsforhold;
    tidligereArbeidsforhold?: ITidligereArbeidsforhold[];
    andreYtelser?: IAndreYtelser;
}