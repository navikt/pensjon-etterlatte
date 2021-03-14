export interface IArbeidsforhold {
    yrke: string;
    stilling: string;
    startDato: string;
    sluttDato: string;
    ansettelsesforhold: string; // låse valg til type?
    heltidDeltid: string;
    stillingsprosent: string;
    arbeidsgiver: {
        navn: string;
        adresse: string;
    };
    inntekt: {
        bruttoArbeidsinntektPrMd: string;
        personinntektFraNaeringPrAr: string;
    };
}

export enum ArbeidsforholdActionTypes {
    OPPDATER_YRKE,
    OPPDATER_STILLING,
    OPPDATER_START_DATO,
    OPPDATER_SLUTT_DATO,

    OPPDATER_ANSETTELSESFORHOLD,
    OPPDATER_HELTID_DELTID,
    OPPDATER_STILLINGSPROSENT,

    OPPDATER_ARBEIDSGIVER_NAVN,
    OPPDATER_ARBEIDSGIVER_ADRESSE,

    OPPDATER_BRUTTO_ARBEIDSINNTEKT,
    OPPDATER_PERSONINNTEKT,
}

export interface IArbeidsforholdAction {
    type: ArbeidsforholdActionTypes;
    payload: any;
}

export interface ArbeidsforholdProps {
    state: IArbeidsforhold;
    dispatch: (action: IArbeidsforholdAction) => void;
}
