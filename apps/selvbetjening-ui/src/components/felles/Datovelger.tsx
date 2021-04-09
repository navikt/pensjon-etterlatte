import React, { FC, useEffect } from "react";
import DatePicker from "react-datepicker";
import { Label } from "nav-frontend-skjema";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import nb from "date-fns/locale/nb";
import { v4 as uuid } from "uuid";

interface Props {
    label: React.ReactNode;
    valgtDato: Date | null;
    onChange: (dato: Date) => void;
}

// TODO: Støtte nynorsk og engelsk
registerLocale("nb", nb);

const Datovelger: FC<Props> = ({ label, valgtDato, onChange }) => {
    useEffect(() => {
        setDefaultLocale("nb");
    }, []);

    const name = uuid();

    return (
        <div className={"skjemaelement"}>
            <Label htmlFor={name}>{label}</Label>

            <DatePicker
                name={name}
                className={"skjemaelement__input input--fullbredde"}
                selected={valgtDato}
                dateFormat={"dd.MM.yy"}
                placeholderText={"dd.mm.åå"}
                onChange={onChange}
            />
        </div>
    );
};

export default Datovelger;
