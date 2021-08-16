import { ReactNode, useEffect } from "react";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { Label, SkjemaelementFeilmelding } from "nav-frontend-skjema";
import { parseISO } from "date-fns";
import { enUS as en, nb, nn } from "date-fns/locale";
import { useTranslation } from "react-i18next";
import { Controller, FieldError, useFormContext } from "react-hook-form";
import { FieldPath } from "react-hook-form/dist/types";
import classnames from "classnames";
import { get } from "lodash";
import { getTransKey } from "../../utils/translation";
import "react-datepicker/dist/react-datepicker.css";

interface DatovelgerProps {
    name: FieldPath<any>;
    label: ReactNode;
    description?: ReactNode;
    minDate?: Date | string;
    maxDate?: Date | string;
    valgfri?: boolean;
    className?: string;
}

const parseDate = (dato?: Date | string) => {
    if (!dato) return;
    else if (typeof dato === "string") return parseISO(dato);
    else return dato;
};

/*
* TODO: Ikke mulig å enkelt tabbe gjennom datovelgeren... må fikses!
*/
const Datovelger = ({ name, label, description, minDate, maxDate, valgfri, className }: DatovelgerProps) => {
    const { t, i18n } = useTranslation();
    const { control, formState: { errors } } = useFormContext();

    registerLocale("nb", nb);
    registerLocale("nn", nn);
    registerLocale("en", en);

    useEffect(() => {
        setDefaultLocale(i18n.language);
    }, [i18n.language]);

    const error: FieldError = get(errors, name)
    const feilmelding = t(getTransKey(error))

    const dateInputCls = classnames(
        "skjemaelement__input",
        feilmelding && "skjemaelement__input--harFeil"
    );

    return (
        <>
            <section className={`skjemaelement ${className}`}>
                <Label htmlFor={name}>{label}</Label>

                {description && (
                    <div className={"skjemaelement__description"}>
                        {description}
                    </div>
                )}

                <Controller
                    name={name}
                    control={control}
                    defaultValue={undefined}
                    rules={{required: !valgfri}}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <DatePicker
                            id={name}
                            className={dateInputCls}
                            selected={parseDate(value)}
                            dateFormat={"dd.MM.yyyy"}
                            placeholderText={"dd.mm.åååå"}
                            onChange={onChange}
                            onBlur={onBlur}
                            minDate={parseDate(minDate)}
                            maxDate={parseDate(maxDate)}
                        />
                    )}
                />

                {feilmelding && <SkjemaelementFeilmelding>{feilmelding}</SkjemaelementFeilmelding>}
            </section>
        </>
    );
};

export default Datovelger;
