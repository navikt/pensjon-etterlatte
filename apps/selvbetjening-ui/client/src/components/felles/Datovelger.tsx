import { ReactNode } from "react";
import "@navikt/ds-datepicker/lib/index.css";
import { Datepicker } from "@navikt/ds-datepicker";
import { DatepickerLocales } from "@navikt/ds-datepicker/lib/types";
import { Label, SkjemaelementFeilmelding } from "nav-frontend-skjema";
import { Controller, FieldError, useFormContext } from "react-hook-form";
import { FieldPath } from "react-hook-form/dist/types";
import { useTranslation } from "react-i18next";
import { parseISO, format } from "date-fns";
import { get } from "lodash";
import { getTransKey } from "../../utils/translation";
import "./Datovelger.scss";

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
    else if (typeof dato === "string") return format(parseISO(dato), "yyyy-MM-dd");
    else return format(dato, "yyyy-MM-dd");
};

const Datovelger = ({ name, label, description, minDate, maxDate, valgfri, className }: DatovelgerProps) => {
    const { t, i18n } = useTranslation();
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const error: FieldError = get(errors, name);
    const feilmelding = t(getTransKey(error));

    return (
        <section className={`skjemaelement ${className}`}>
            <Label htmlFor={name}>{`${label} ${t("felles.datoformat")}`}</Label>

            {description && <div className={"skjemaelement__description"}>{description}</div>}

            <div className="datovelger">
                <Controller
                    name={name}
                    control={control}
                    defaultValue={undefined}
                    rules={{ required: !valgfri }}
                    render={({ field: { onChange, value } }) => (
                        <Datepicker
                            locale={i18n.language as DatepickerLocales}
                            value={value}
                            onChange={onChange}
                            inputId={name}
                            inputProps={{
                                name,
                                "aria-invalid": feilmelding.length !== 0,
                                placeholder: t("felles.datoEksempel"),
                            }}
                            showYearSelector={true}
                            limitations={{
                                minDate: parseDate(minDate),
                                maxDate: parseDate(maxDate),
                            }}
                        />
                    )}
                />
            </div>

            {feilmelding && <SkjemaelementFeilmelding>{feilmelding}</SkjemaelementFeilmelding>}
        </section>
    );
};

export default Datovelger;
