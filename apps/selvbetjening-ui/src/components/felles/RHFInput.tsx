import { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";
import { Controller, FieldError, useFormContext } from "react-hook-form";
import { FieldPath, FieldValues } from "react-hook-form/dist/types";
import { Input } from "nav-frontend-skjema";
import { get } from "lodash"
import { useTranslation } from "react-i18next";
import { RegisterOptions } from "react-hook-form/dist/types/validator";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    name: FieldPath<FieldValues>;
    label: ReactNode;
    rules?: Omit<RegisterOptions<FieldValues, FieldPath<FieldValues>>, 'required'>;
}

export const RHFInput = ({name, label, rules, ...rest}: Props) => {
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
                    {...rest}
                />
            )}
        />
    )
};

export const RHFKontonummerInput = ({name, label, rules, ...rest}: Props) => {
    const { t } = useTranslation();
    const { control, formState: { errors }} = useFormContext();

    const error: FieldError = get(errors, name)

    const format = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value

        const match = value.match(/^([1-9]\d{0,3})\.?(\d{0,2})\.?(\d{0,5})$/)

        if (match) {
            const bankreg = match[1]
            const kontogruppe = match[2] ? `.${match[2]}` : ""
            const kundenummer = match[3] ? `.${match[3]}` : ""

            return `${bankreg}${kontogruppe}${kundenummer}`;
        }

        return value.substring(0, (value.length - 1))
    }

    return (
        <Controller
            name={name}
            control={control}
            rules={{required: true, ...rules}}
            render={({ field: { value, onChange } }) => (
                <Input
                    id={name}
                    value={value || ""}
                    onChange={(e) => onChange(format(e))}
                    label={label}
                    feil={error && t(`feil.${error.ref?.name}.${error.type}`)}
                    maxLength={13}
                    {...rest}
                />
            )}
        />
    )
};

export const RHFTelefonInput = ({name, label, rules, ...rest}: Props) => {
    const { t } = useTranslation();
    const { control, formState: { errors }} = useFormContext();

    const error: FieldError = get(errors, name)

    const format = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value

        const match = value.match(/^([1-9]\d{0,2})\s?(\d{0,2})\s?(\d{0,3})$/)

        if (match) {
            const gruppe1 = match[1]
            const gruppe2 = match[2] ? ` ${match[2]}` : ""
            const gruppe3 = match[3] ? ` ${match[3]}` : ""

            return `${gruppe1}${gruppe2}${gruppe3}`;
        }

        return value.substring(0, (value.length - 1))
    }

    return (
        <Controller
            name={name}
            control={control}
            rules={{required: true, ...rules}}
            render={({ field: { value, onChange } }) => (
                <Input
                    id={name}
                    value={value || ""}
                    onChange={(e) => onChange(format(e))}
                    label={label}
                    feil={error && t(`feil.${error.ref?.name}.${error.type}`)}
                    maxLength={13}
                    {...rest}
                />
            )}
        />
    )
};

