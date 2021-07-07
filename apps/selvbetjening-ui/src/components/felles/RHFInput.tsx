import { ChangeEvent, ReactNode } from "react";
import { Controller, FieldError, useFormContext } from "react-hook-form";
import { FieldPath, FieldValues } from "react-hook-form/dist/types";
import { Input, InputProps } from "nav-frontend-skjema";
import { get } from "lodash"
import { useTranslation } from "react-i18next";
import { RegisterOptions } from "react-hook-form/dist/types/validator";
import { getTransKey } from "../../utils/Utils";
import { fnr } from "@navikt/fnrvalidator";

interface RHFProps extends Omit<InputProps, 'name'> {
    name: FieldPath<FieldValues>;
    label: ReactNode;
    rules?: Omit<RegisterOptions<FieldValues, FieldPath<FieldValues>>, 'required'>;
}

export const RHFInput = ({name, rules, ...rest}: RHFProps) => {
    const { t } = useTranslation();
    const { control, formState: { errors }} = useFormContext();

    const error: FieldError = get(errors, name)

    const feilmelding = t(getTransKey(error))

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
                    feil={feilmelding}
                    {...rest}
                />
            )}
        />
    )
};

export const RHFKontonummerInput = ({name, rules, ...rest}: RHFProps) => {
    const { t } = useTranslation();
    const { control, formState: { errors }} = useFormContext();

    const error: FieldError = get(errors, name)

    const feilmelding = t(getTransKey(error))

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
                    feil={feilmelding}
                    maxLength={13}
                    {...rest}
                />
            )}
        />
    )
};

export const RHFTelefonInput = ({name, rules, ...rest}: RHFProps) => {
    const { t } = useTranslation();
    const { control, formState: { errors }} = useFormContext();

    const error: FieldError = get(errors, name)

    const feilmelding = t(getTransKey(error))

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
                    feil={feilmelding}
                    maxLength={13}
                    {...rest}
                />
            )}
        />
    )
};

export const RHFFoedselsnummerInput = ({ ...rest }: RHFProps) => {
    return (
        <RHFInput
            {...rest}
            type={"number"}
            rules={{ validate: (value) => (fnr(value).status === 'valid') }}
        />
    )
}
