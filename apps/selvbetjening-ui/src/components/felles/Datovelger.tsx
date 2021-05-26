import { ReactNode, useEffect } from "react";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import { Label, SkjemaelementFeilmelding } from "nav-frontend-skjema";
import { parseISO } from "date-fns";
import { enUS as en, nb, nn } from "date-fns/locale";
import { v4 as uuid } from "uuid";
import { useTranslation } from "react-i18next";
import { Controller } from "react-hook-form";
import { FieldPath } from "react-hook-form/dist/types";
import classnames from "classnames";
import { Control } from "react-hook-form/dist/types/form";

interface DatovelgerProps {
    name: FieldPath<any>;
    control: Control<any>;
    label: string;
    feil?: ReactNode | boolean;
}

const parseDate = (dato: Date | string) => {
    if (typeof dato === "string") return parseISO(dato);
    else return dato;
};

/*
* TODO: Ikke mulig å enkelt tabbe gjennom datovelgeren... må fikses!
*/
const Datovelger = ({ name, control, label, feil }: DatovelgerProps) => {
    const { i18n } = useTranslation();

    registerLocale("nb", nb);
    registerLocale("nn", nn);
    registerLocale("en", en);

    useEffect(() => {
        setDefaultLocale(i18n.language);
    }, [i18n.language]);

    const id = uuid();

    const classNames = classnames(
        "skjemaelement__input",
        "input--fullbredde",
        feil && "skjemaelement__input--harFeil"
    );

    return (
        <section className={"skjemaelement"}>
            <Label htmlFor={id}>{label}</Label>

            <Controller
                name={name}
                control={control}
                defaultValue={undefined}
                render={({ field: { onChange, onBlur, value } }) => (
                    <DatePicker
                        id={id}
                        className={classNames}
                        selected={parseDate(value)}
                        dateFormat={"dd.MM.yy"}
                        placeholderText={"dd.mm.åå"}
                        onChange={onChange}
                        onBlur={onBlur}
                    />
                )}
            />

            {feil && <SkjemaelementFeilmelding>{feil}</SkjemaelementFeilmelding>}
        </section>
    );
};

export default Datovelger;
