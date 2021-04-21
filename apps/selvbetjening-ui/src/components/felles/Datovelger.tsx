import { FC, useEffect } from "react";
import DatePicker from "react-datepicker";
import { Label } from "nav-frontend-skjema";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { parseISO } from "date-fns";
import { nb, nn, enUS as en } from "date-fns/locale";
import { v4 as uuid } from "uuid";
import { useTranslation } from "react-i18next";

interface Props {
    label: string;
    valgtDato?: Date | string | null;
    onChange: (dato: Date) => void;
    showMonthYearPicker?: boolean;
}

const Datovelger: FC<Props> = ({ label, valgtDato, onChange, showMonthYearPicker }) => {
    const { i18n } = useTranslation();

    registerLocale("nb", nb);
    registerLocale("nn", nn);
    registerLocale("en", en);

    useEffect(() => {
        setDefaultLocale(i18n.language);
    }, [i18n.language]);

    let dato: Date | null | undefined;
    if (typeof valgtDato === "string") {
        dato = parseISO(valgtDato);
    } else {
        dato = valgtDato;
    }

    const name = uuid();

    return (
        <section className={"skjemaelement"}>
            <Label htmlFor={name}>{label}</Label>

            <DatePicker
                name={name}
                tabIndex={5}
                className={"skjemaelement__input input--fullbredde"}
                selected={dato}
                dateFormat={showMonthYearPicker ? "MM.yy" : "dd.MM.yy"}
                placeholderText={showMonthYearPicker ? "mm.åå" : "dd.mm.åå"}
                onChange={onChange}
                showMonthYearPicker
            />
        </section>
    );
};

export default Datovelger;
