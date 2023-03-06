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
import styled from "styled-components"

const DatovelgerWrapper = styled.div`
    > div {
    width: 100%;
  }
  
  .ds-datepicker {
  width: 100%;

  input {
    min-height: 40px;
  }

  .skjemaelement__input--harFeil:not(:focus):not(:hover):not(:active):not(.inputPanel--focused) {
    border: none;
    box-shadow: none;
    input {
      border-color: #ba3a26;
      box-shadow: 0 0 0 1px #ba3a26;
    }
  }
}
`

interface StyledProps {
    kol: boolean
}

const DatovelgerSection = styled.section<StyledProps>`
    margin-bottom: 0 !important;

    ${props => 
        props.kol ? "flex-grow: 1; flex-basis: auto;" : ""
    }  
`

interface DatovelgerProps {
    name: FieldPath<any>;
    label: ReactNode;
    description?: ReactNode;
    minDate?: Date | string;
    maxDate?: Date | string;
    valgfri?: boolean;
    className?: string;
    kol?: boolean;
}

const parseDate = (dato?: Date | string) => {
    try {
        if (!dato)
            return undefined;
        else if (typeof dato === "string")
            return format(parseISO(dato), "yyyy-MM-dd");
        else
            return format(parseISO(dato.toISOString()), "yyyy-MM-dd");
    } catch {
        return undefined;
    }
};

const isValid = (date: any): boolean => !!parseDate(date);

const Datovelger = ({ name, label, description, minDate, maxDate, valgfri, kol = false }: DatovelgerProps) => {
    const { t, i18n } = useTranslation();
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const error: FieldError = get(errors, name);
    const feilmelding = t(getTransKey(error));

    return (
        <DatovelgerSection kol={kol}>
            <Label htmlFor={name}>{`${label} ${t("felles.datoformat")}`}</Label>

            {description && <div className={"skjemaelement__description"}>{description}</div>}

            <DatovelgerWrapper>
                <Controller
                    name={name}
                    control={control}
                    defaultValue={undefined}
                    rules={{
                        required: !valgfri,
                        validate: (date) => !date || isValid(date)
                    }}
                    render={({ field: { onChange, value } }) => (
                        <Datepicker
                            locale={i18n.language as DatepickerLocales}
                            value={value}
                            onChange={(date) => onChange(parseDate(date))}
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
            </DatovelgerWrapper>

            {feilmelding && <SkjemaelementFeilmelding>{feilmelding}</SkjemaelementFeilmelding>}
        </DatovelgerSection>
    );
};

export default Datovelger;
