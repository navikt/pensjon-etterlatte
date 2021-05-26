import { date, number, object, SchemaOf, string } from "yup";
import { IArbeidsforhold } from "../../../typer/arbeidsforhold";

/**
 * STEG 6: Opplysninger om nåværende arbeidsforhold
 */
const NaavaerendeArbeidsforholdSchema: SchemaOf<IArbeidsforhold> = object().shape({
    yrke: string().required(),
    stilling: string().required(),
    startDato: date().required(),
    sluttDato: date().required(),
    ansettelsesforhold: string().required(), // låse valg til type
    heltidDeltid: string().required(),
    stillingsprosent: number(),
    arbeidsgiver: object().shape({
        navn: string().required(),
        adresse: string().required(),
    }),
    inntekt: object().shape({
        bruttoArbeidsinntektPrMd: string().required(),
        personinntektFraNaeringPrAr: string().required(),
    }),
});

export default NaavaerendeArbeidsforholdSchema;
