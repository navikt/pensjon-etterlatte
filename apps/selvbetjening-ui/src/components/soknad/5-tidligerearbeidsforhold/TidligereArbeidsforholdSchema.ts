import { date, object, SchemaOf, string } from "yup";
import { ITidligereArbeidsforhold } from "../../../typer/arbeidsforhold";

/**
 * STEG 5: Opplysninger om tidligere arbeidsforhold
 */
const TidligereArbeidsforholdSchema: SchemaOf<ITidligereArbeidsforhold> = object().shape({
    beskrivelse: string().required(),
    fraDato: date().required(),
    tilDato: date().required(),
});

export default TidligereArbeidsforholdSchema;
