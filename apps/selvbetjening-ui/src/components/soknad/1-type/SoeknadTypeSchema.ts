import { date, mixed, object, SchemaOf } from "yup";
import { IStoenadType, Ytelse } from "../../../typer/ytelser";
import IValg from "../../../typer/IValg";

/**
 * STEG 1: Søknad type
 */
const SoeknadTypeSchema: SchemaOf<IStoenadType> = object().shape({
    valgteYtelser: object().shape({
        hovedytelse: mixed<Ytelse>().required(),
        barnepensjon: mixed<IValg>().required(),
    }),
    fraDato: date().required(),
});

export default SoeknadTypeSchema;
