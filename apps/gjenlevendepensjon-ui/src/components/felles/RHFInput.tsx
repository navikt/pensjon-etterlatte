import { ChangeEvent } from "react";
import { Controller, FieldError, useFormContext } from "react-hook-form";
import { FieldPath, FieldValues } from "react-hook-form/dist/types";
import { TextField, TextFieldProps } from "@navikt/ds-react";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import { RegisterOptions } from "react-hook-form/dist/types/validator";
import { getTransKey } from "../../utils/translation";
import { fnr } from "@navikt/fnrvalidator";
import {
    kontonrMatcher,
    partialKontonrMatcher,
    partialProsentMatcher,
    prosentMatcher,
    telefonnrMatcher,
} from "../../utils/matchers";
import { isValidBIC, isValidIBAN } from "ibantools";

interface RHFProps extends Omit<TextFieldProps, "name"> {
    name: FieldPath<FieldValues>;
    rules?: Omit<RegisterOptions<FieldValues, FieldPath<FieldValues>>, "required">;
    valgfri?: boolean;
}

export const RHFInput = ({ name, rules, className, valgfri, ...rest }: RHFProps) => {
    const { t } = useTranslation();
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const error: FieldError = get(errors, name);
    const feilmelding = !!error ? t(getTransKey(error)) : undefined;

    return (
        <Controller
            name={name}
            control={control}
            rules={{ required: !valgfri, ...rules }}
            render={({ field: { value, onChange } }) => (
                <div className={className}>
                    <TextField
                        id={name}
                        value={value || ""}
                        required={!valgfri}
                        onChange={onChange}
                        error={feilmelding}
                        {...rest}
                    />
                </div>
            )}
        />
    );
};

const match = (value: any, matcher: RegExp, separator: string) => {
    const match = value.match(matcher);

    if (!!match) {
        const del1 = match[1];
        const del2 = match[2] ? `${separator}${match[2]}` : "";
        const del3 = match[3] ? `${separator}${match[3]}` : "";

        return `${del1}${del2}${del3}`;
    }

    return undefined;
};

const format = (e: ChangeEvent<HTMLInputElement>, matcher: RegExp, separator = " "): string => {
    const value = e.target.value;

    const result = match(value, matcher, separator);

    return result || value.substring(0, value.length - 1);
};

export const RHFKontonummerInput = ({ name, rules, ...rest }: RHFProps) => {
    const { t } = useTranslation();
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const error: FieldError = get(errors, name);
    const feilmelding = !!error ? t(getTransKey(error)) : undefined;

    return (
        <Controller
            name={name}
            control={control}
            rules={{ required: true, pattern: kontonrMatcher, ...rules }}
            render={({ field: { value, onChange } }) => (
                <TextField
                    id={name}
                    value={value || ""}
                    required
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(format(e, partialKontonrMatcher, "."))}
                    error={feilmelding}
                    {...rest}
                />
            )}
        />
    );
};

export const RHFValutaInput = ({ name, valgfri, ...rest }: RHFProps) => {
    const { t } = useTranslation();
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const error: FieldError = get(errors, name);
    const feilmelding = !!error ? t(getTransKey(error)) : undefined;

    return (
        <Controller
            name={name}
            control={control}
            rules={{ required: !valgfri, pattern: /^\d[0-9\s]*$/ }}
            render={({ field: { value, onChange } }) => (
                <TextField
                    id={name}
                    value={value || ""}
                    required={!valgfri}
                    onChange={onChange}
                    error={feilmelding}
                    {...rest}
                />
            )}
        />
    );
};

export const RHFProsentInput = ({ name, rules, ...rest }: RHFProps) => {
    const { t } = useTranslation();
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const error: FieldError = get(errors, name);
    const feilmelding = !!error ? t(getTransKey(error)) : undefined;
    const maxLength = 4;

    const isValid = (e: ChangeEvent<HTMLInputElement>): boolean => {
        return (
            e.target.value === "" ||
            (partialProsentMatcher.test(e.target.value) && (!maxLength || e.target.value.length <= maxLength))
        );
    };

    return (
        <Controller
            name={name}
            control={control}
            rules={{ required: true, pattern: prosentMatcher, ...rules }}
            render={({ field: { value, onChange } }) => (
                <TextField
                    id={name}
                    required
                    value={value || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        if (isValid(e)) onChange(e);
                    }}
                    error={feilmelding}
                    {...rest}
                />
            )}
        />
    );
};

export const RHFTelefonInput = ({ name, rules, valgfri, ...rest }: RHFProps) => {
    const { t } = useTranslation();
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const error: FieldError = get(errors, name);
    const feilmelding = !!error ? t(getTransKey(error)) : undefined;

    return (
        <Controller
            name={name}
            control={control}
            rules={{
                required: !valgfri,
                pattern: telefonnrMatcher,
                minLength: 8,
                ...rules
            }}
            render={({ field: { value, onChange } }) => (
                <TextField
                    id={name}
                    required
                    value={value || ""}
                    onChange={onChange}
                    error={feilmelding}
                    {...rest}
                />
            )}
        />
    );
};

export const RHFFoedselsnummerInput = ({ name, rules, valgfri, ...rest }: RHFProps) => {
    const { t } = useTranslation();
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const error: FieldError = get(errors, name);
    const feilmelding = !!error ? t(getTransKey(error)) : undefined;

    const isValid = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        return !isNaN(Number(value)) && value.length <= 11;
    };

    return (
        <Controller
            name={name}
            control={control}
            rules={{
                required: !valgfri,
                validate: (value) => !value || fnr(value).status === "valid",
                ...rules
            }}
            render={({ field: { value, onChange } }) => (
                <TextField
                    id={name}
                    type="tel"
                    required
                    value={value || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        if (isValid(e)) onChange(e);
                    }}
                    error={feilmelding}
                    {...rest}
                />
            )}
        />
    );
};

export const RHFIbanInput = ({ name, ...rest }: RHFProps) => {
    const { t } = useTranslation();
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const error: FieldError = get(errors, name);
    const feilmelding = !!error ? t(getTransKey(error)) : undefined;

    return (
        <Controller
            name={name}
            control={control}
            rules={{ required: true, validate: (value) => isValidIBAN(value) }}
            render={({ field: { value, onChange } }) => (
                <TextField
                    id={name}
                    required
                    value={value || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value.toUpperCase())}
                    error={feilmelding}
                    {...rest}
                />
            )}
        />
    );
};

export const RHFBicInput = ({ name, ...rest }: RHFProps) => {
    const { t } = useTranslation();
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const error: FieldError = get(errors, name);
    const feilmelding = !!error ? t(getTransKey(error)) : undefined;

    return (
        <Controller
            name={name}
            control={control}
            rules={{ required: true, validate: (value) => isValidBIC(value) }}
            render={({ field: { value, onChange } }) => (
                <TextField
                    id={name}
                    required
                    value={value || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value.toUpperCase())}
                    error={feilmelding}
                    {...rest}
                />
            )}
        />
    );
};

export const RHFNumberInput = ({ name, minLength, maxLength, ...rest }: RHFProps) => {
    const { t } = useTranslation();
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const error: FieldError = get(errors, name);
    const feilmelding = !!error ? t(getTransKey(error)) : undefined;

    const re = /^[0-9\b]+$/;
    const isValid = (e: ChangeEvent<HTMLInputElement>): boolean => {
        return e.target.value === "" || (re.test(e.target.value) && (!maxLength || e.target.value.length <= maxLength));
    };

    return (
        <Controller
            name={name}
            control={control}
            rules={{ required: true, minLength, maxLength }}
            render={({ field: { value, onChange } }) => (
                <TextField
                    id={name}
                    required
                    value={value || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        if (isValid(e)) onChange(e);
                    }}
                    error={feilmelding}
                    {...rest}
                />
            )}
        />
    );
};
