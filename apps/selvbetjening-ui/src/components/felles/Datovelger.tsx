import { FC, useEffect } from "react";
import DatePicker from "react-datepicker";
import { Label } from "nav-frontend-skjema";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { parseISO } from "date-fns";
import nb from "date-fns/locale/nb";
import { v4 as uuid } from "uuid";

interface Props {
    label: string;
    valgtDato: Date | string | null;
    onChange: (dato: Date) => void;
    showMonthYearPicker?: boolean;
}

// TODO: Støtte nynorsk og engelsk
registerLocale("nb", nb);

const Datovelger: FC<Props> = ({ label, valgtDato, onChange, showMonthYearPicker }) => {
    useEffect(() => {
        setDefaultLocale("nb");
    }, []);

    let dato: Date | null;
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
