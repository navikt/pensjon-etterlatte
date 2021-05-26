export interface IArbeidsforhold {
    yrke?: string;
    stilling?: string;
    startDato?: Date;
    sluttDato?: Date;
    ansettelsesforhold?: string; // låse valg til type?
    heltidDeltid?: string;
    stillingsprosent?: number | null;
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
