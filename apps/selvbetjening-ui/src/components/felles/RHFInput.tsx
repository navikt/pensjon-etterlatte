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

const match = (value: any, matcher: RegExp, separator: string) => {
    const match = value.match(matcher)

    if (!!match) {
        const del1 = match[1]
        const del2 = match[2] ? `${separator}${match[2]}` : ""
        const del3 = match[3] ? `${separator}${match[3]}` : ""

        return `${del1}${del2}${del3}`;
    }

    return undefined;
}

const format = (
    e: ChangeEvent<HTMLInputElement>,
    matcher: RegExp,
    separator: string = " "
): string => {
    const value = e.target.value

    const result = match(value, matcher, separator)

    return result || value.substring(0, (value.length - 1))
};

export const RHFKontonummerInput = ({name, rules, ...rest}: RHFProps) => {
    const { t } = useTranslation();
    const { control, formState: { errors }} = useFormContext();

    const error: FieldError = get(errors, name)
    const feilmelding = t(getTransKey(error))

    const matcher = /^([1-9]\d{0,3})\.?(\d{0,2})\.?(\d{0,5})$/

    return (
        <Controller
            name={name}
            control={control}
            rules={{required: true, ...rules}}
            render={({ field: { value, onChange } }) => (
                <Input
                    id={name}
                    value={value || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(format(e, matcher, "."))}
                    feil={feilmelding}
                    {...rest}
                />
            )}
        />
    )
};

export const RHFValutaInput = ({name, rules, ...rest}: RHFProps) => {
    const { t } = useTranslation();
    const { control, formState: { errors }} = useFormContext();

    const error: FieldError = get(errors, name)
    const feilmelding = t(getTransKey(error))

    const matcher = /^([1-9]\d{0,2})\s?(\d{0,3})\s?(\d{0,3})$/

    return (
        <Controller
            name={name}
            control={control}
            rules={{required: true, ...rules}}
            render={({ field: { value, onChange } }) => (
                <Input
                    id={name}
                    value={value || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(format(e, matcher))}
                    feil={feilmelding}
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

    const matcher = /^([1-9]\d{0,2})\s?(\d{0,2})\s?(\d{0,3})$/

    return (
        <Controller
            name={name}
            control={control}
            rules={{required: true, ...rules}}
            render={({ field: { value, onChange } }) => (
                <Input
                    id={name}
                    value={value || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(format(e, matcher))}
                    feil={feilmelding}
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
