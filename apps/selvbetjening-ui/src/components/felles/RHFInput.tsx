import { ReactNode } from "react";
import { Controller, FieldError, useFormContext } from "react-hook-form";
import { FieldPath, FieldValues } from "react-hook-form/dist/types";
import { Input } from "nav-frontend-skjema";
import { get } from "lodash"
import { useTranslation } from "react-i18next";
import { RegisterOptions } from "react-hook-form/dist/types/validator";

interface InputProps {
    name: FieldPath<FieldValues>;
    label: ReactNode;
    rules?: Omit<RegisterOptions<FieldValues, FieldPath<FieldValues>>, 'required'>;
}

const RHFInput = ({name, label, rules}: InputProps) => {
    const { t } = useTranslation();
    const { control, formState: { errors }} = useFormContext();

    const error: FieldError = get(errors, name)

    return (
        <Controller
            name={name}
            control={control}
            rules={{required: true, ...rules}}
            render={({ field: { value, onChange } }) => (
                <Input
                    id={name}
                    value={value || ""}
                    onChange={onChange}
                    label={label}
                    feil={error && t(`feil.${error.ref?.name}.${error.type}`)}
                />
            )}
        />
    )
}

export default RHFInput;
