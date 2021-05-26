import { mixed, object, string, ValidationError } from "yup";
import IValg from "../../../typer/IValg";

/*
 * STEG 4: Opplysninger om barn
 */
export default object()
    .shape({
        fornavn: string()
            .matches(/^[A-Åa-å\s]+$/)
            .required(),
        etternavn: string()
            .matches(/^[A-Åa-å\s]+$/)
            .required(),
        foedselsnummer: string()
            .matches(/^[0-9]{11}$/)
            .required(),
        foreldre: string().required(),
        bosattUtland: mixed<IValg>().oneOf(Object.values(IValg)).required(),
        statsborgerskap: string(),
        land: string(),
    })
    .test((data) => {
        if (data.bosattUtland === IValg.JA) {
            let errors: ValidationError[] = [];

            if (!data.statsborgerskap)
                errors.push(new ValidationError("statsborgerskap", undefined, "statsborgerskap"));

            if (!data.land) errors.push(new ValidationError("land", undefined, "land"));

            if (errors.length) return new ValidationError(errors);
        }

        return true;
    });
