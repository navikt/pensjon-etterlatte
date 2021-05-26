import { ReactNode } from "react";
import { Controller, FieldError, useFormContext } from "react-hook-form";
import { FieldPath, FieldValues } from "react-hook-form/dist/types";
import { Input } from "nav-frontend-skjema";
import _ from "lodash"

interface InputProps {
    name: FieldPath<FieldValues>;
    label: ReactNode;
}

const RHFInput = ({name, label}: InputProps) => {
    const { control, formState: { errors }} = useFormContext();

    const error: FieldError = _.get(errors, name)

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { value, onChange } }) => (
                <Input
                    value={value || ""}
                    onChange={onChange}
                    label={label}
                    feil={error?.message}
                />
            )}
        />
    )
}

export default RHFInput;
