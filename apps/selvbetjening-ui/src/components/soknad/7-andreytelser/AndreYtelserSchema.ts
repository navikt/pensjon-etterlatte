import { mixed, object, SchemaOf, string } from "yup";
import { IAndreYtelser } from "../../../typer/ytelser";
import IValg from "../../../typer/IValg";

/**
 * STEG 7: Opplysninger om andre ytelser
 */
const AndreYtelserSchema: SchemaOf<IAndreYtelser> = object().shape({
    mottarAndreYtelser: mixed<IValg>().required(),
    kravOmAnnenStonad: object().shape({
        svar: mixed<IValg>().required(),
        beskrivelseAvStoenad: string(),
    }),
    mottarPensjonUtland: object().shape({
        svar: mixed<IValg>().required(),
        hvaSlagsPensjon: string(),
        fraHvilketLand: string(),
        bruttobeloepPrAar: string(),
        landetsValuta: string(),
    }),
});

export default AndreYtelserSchema;
