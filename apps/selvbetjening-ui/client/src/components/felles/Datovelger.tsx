import { ReactNode, useEffect, useRef } from "react";
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
    else if (typeof dato === "string") return parseISO(dato);
    else return dato;
};

/*
 * TODO: Ikke mulig å enkelt tabbe gjennom datovelgeren... må fikses!
 */
const Datovelger = ({ name, label, description, minDate, maxDate, valgfri, className }: DatovelgerProps) => {
    const { t, i18n } = useTranslation();
    const datepickerRef: any = useRef(null);
    const {
        control,
        formState: { errors },
    } = useFormContext();

    registerLocale("nb", nb);
    registerLocale("nn", nn);
    registerLocale("en", en);

    useEffect(() => {
        setDefaultLocale(i18n.language);
    }, [i18n.language]);

    const toggleDatepicker = () => {
        datepickerRef.current.setOpen(true);
        datepickerRef.current.setFocus();
    };

    const error: FieldError = get(errors, name);
    const feilmelding = t(getTransKey(error));

    const dateInputCls = classnames("skjemaelement__input dato-input", feilmelding && "skjemaelement__input--harFeil");

    return (
        <>
            <section className={`skjemaelement ${className}`}>
                <Label htmlFor={name}>{label} {t("felles.datoformat")}</Label>

                {description && <div className={"skjemaelement__description"}>{description}</div>}

                <div className="datovelger">
                    <Controller
                        name={name}
                        control={control}
                        defaultValue={undefined}
                        rules={{ required: !valgfri }}
                        render={({ field: { onChange, onBlur, value } }) => (
                            <>
                                <DatePicker
                                    autoComplete="off"
                                    ref={datepickerRef}
                                    id={name}
                                    required={!valgfri}
                                    preventOpenOnFocus={true}
                                    className={dateInputCls}
                                    selected={parseDate(value)}
                                    dateFormat={"dd.MM.yyyy"}
                                    placeholderText={"eks: 01.12.2020"}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    minDate={parseDate(minDate)}
                                    maxDate={parseDate(maxDate)}
                                    popperPlacement="bottom"
                                />
                                <div
                                    className="kalender-ikon"
                                    tabIndex={0}
                                    onKeyPress={toggleDatepicker}
                                    onClick={toggleDatepicker}
                                    role="button"
                                    title="Åpne datovelger"
                                    aria-label="Åpne datovelger"
                                >
                                    <svg
                                        height="24px"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-hidden="true"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M6 7V5H2v5h20V5h-4v2a1 1 0 11-2 0V5H8v2a1 1 0 11-2 0zm10-4H8V1a1 1 0 10-2 0v2H2a2 2 0 00-2 2v17a2 2 0 002 2h20a2 2 0 002-2V5a2 2 0 00-2-2h-4V1a1 1 0 10-2 0v2zM2 12v10h20V12H2zm6 3a1 1 0 00-1-1H5a1 1 0 100 2h2a1 1 0 001-1zm-1 3a1 1 0 110 2H5a1 1 0 110-2h2zm6-4h-2a1 1 0 100 2h2a1 1 0 100-2zm-2 4h2a1 1 0 110 2h-2a1 1 0 110-2zm9-3a1 1 0 00-1-1h-2a1 1 0 100 2h2a1 1 0 001-1zm-4 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z"
                                            fill="#fff"
                                        ></path>
                                    </svg>
                                </div>
                            </>
                        )}
                    />
                </div>

                {feilmelding && <SkjemaelementFeilmelding>{feilmelding}</SkjemaelementFeilmelding>}
            </section>
        </>
    );
};

export default Datovelger;
