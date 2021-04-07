import { FC, useEffect } from "react";
import { subMonths } from "date-fns";
import DatePicker from "react-datepicker";
import { Label } from "nav-frontend-skjema";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import nb from "date-fns/locale/nb";

interface Props {
    label: string;
    valgtDato: Date | null;
    minDato?: Date | null;
    maksDato?: Date | null;
    onChange: (dato: Date) => void;
}

// TODO: Støtte nynorsk og engelsk
registerLocale("nb", nb);

const Datovelger: FC<Props> = ({ label, valgtDato, onChange }) => {
    useEffect(() => {
        setDefaultLocale("nb");
    }, []);

    return (
        <div className={"skjemaelement"}>
            <Label htmlFor={label}>{label}</Label>

            <DatePicker
                className={"skjemaelement__input input--fullbredde"}
                selected={valgtDato}
                minDate={subMonths(new Date(), 3)}
                dateFormat={"dd.MM.yyyy"}
                placeholderText={"dd.mm.åååå"}
                onChange={onChange}
            />
        </div>
    );
};

export default Datovelger;
