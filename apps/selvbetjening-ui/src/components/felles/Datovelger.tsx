import { ReactNode, useEffect } from "react";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { Label, SkjemaelementFeilmelding, SkjemaGruppe } from "nav-frontend-skjema";
import { parseISO } from "date-fns";
import { enUS as en, nb, nn } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { Controller, FieldError, useFormContext } from "react-hook-form";
import { FieldPath } from "react-hook-form/dist/types";
import classnames from "classnames";
import { get } from "lodash";
import { getTransKey } from "../../utils/Utils";
import "react-datepicker/dist/react-datepicker.css";

interface DatovelgerProps {
    name: FieldPath<any>;
    label: ReactNode;
    minDate?: Date | string;
    maxDate?: Date | string;
}

const parseDate = (dato?: Date | string) => {
    if (!dato) return;
    else if (typeof dato === "string") return parseISO(dato);
    else return dato;
};

/*
* TODO: Ikke mulig å enkelt tabbe gjennom datovelgeren... må fikses!
*/
const Datovelger = ({ name, label, minDate, maxDate }: DatovelgerProps) => {
    const { t, i18n } = useTranslation();
    const { control, formState: { errors } } = useFormContext();

    registerLocale("nb", nb);
    registerLocale("nn", nn);
    registerLocale("en", en);

    useEffect(() => {
        setDefaultLocale(i18n.language);
    }, [i18n.language]);

    const error: FieldError = get(errors, name)
    const feilmelding = t(getTransKey(error) || "")

    const classNames = classnames(
        "skjemaelement__input",
        "input--fullbredde",
        feilmelding && "skjemaelement__input--harFeil"
    );

    return (
        <SkjemaGruppe>
            <section className={"skjemaelement"}>
                <Label htmlFor={name}>{label}</Label>

                <Controller
                    name={name}
                    control={control}
                    defaultValue={undefined}
                    rules={{required: true}}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <DatePicker
                            id={name}
                            className={classNames}
                            selected={parseDate(value)}
                            dateFormat={"dd.MM.yy"}
                            placeholderText={"dd.mm.åå"}
                            onChange={onChange}
                            onBlur={onBlur}
                            minDate={parseDate(minDate)}
                            maxDate={parseDate(maxDate)}
                        />
                    )}
                />

                {feilmelding && <SkjemaelementFeilmelding>{feilmelding}</SkjemaelementFeilmelding>}
            </section>
        </SkjemaGruppe>
    );
};

export default Datovelger;
