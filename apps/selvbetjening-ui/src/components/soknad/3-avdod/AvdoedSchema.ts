import { date, mixed, object, SchemaOf, string } from "yup";
import { IAvdoed } from "../../../typer/person";
import IValg from "../../../typer/IValg";

/**
 * STEG 3: Opplysninger om den avdøde
 */
const AvdoedSchema: SchemaOf<IAvdoed> = object().shape({
    fornavn: string().required(),
    etternavn: string().required(),
    foedselsnummer: string().required(),
    doedsdato: date().required(),
    statsborgerskap: string().required(),
    bosetning: mixed<IValg>().oneOf([IValg.JA, IValg.NEI]).required(),
    doedsfallAarsak: mixed<IValg>().oneOf([IValg.JA, IValg.NEI]).required(),
    boddEllerJobbetUtland: mixed<IValg>().oneOf([IValg.JA, IValg.NEI]).required(),
    haddePensjonsgivendeInntekt: mixed<IValg>().oneOf([IValg.JA, IValg.NEI]).required(),
    pensjonsgivendeInntektSvar: string(),
    haddePensjonAndreLand: mixed<IValg>().oneOf([IValg.JA, IValg.NEI]).required(),
    pensjonAndreLandSvar: string(),
    harAvtjentMilitaerTjeneste: mixed<IValg>().oneOf([IValg.JA, IValg.NEI]).required(),
    avtjentMilitaerTjenesteSvar: string(),
});

export default AvdoedSchema;
