import React, { ReactNode } from "react";
import { RadioPanelGruppe, RadioPanelProps } from "nav-frontend-skjema";
import IValg from "../../typer/IValg";
import { v4 as uuid } from "uuid";
import { Controller, FieldError, useFormContext } from "react-hook-form";
import { FieldPath, FieldValues } from "react-hook-form/dist/types";
import _ from "lodash";
import classnames from "classnames";

export const RHFToValgRadio = ({ name, legend, overrideRadios }: {
    name: FieldPath<FieldValues>;
    legend?: ReactNode;
    overrideRadios?: RadioPanelProps[];
}) => {
    const { control, formState: { errors } } = useFormContext();

    const error: FieldError = _.get(errors, name)

    let radios: RadioPanelProps[] = overrideRadios || [
        { label: IValg.JA, value: IValg.JA },
        { label: IValg.NEI, value: IValg.NEI },
    ];

    const classNames = classnames(
        radios.length === 2 && "to-valg-radio"
    )

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { value, onChange } }) => (
                <RadioPanelGruppe
                    name={uuid()}
                    feil={error?.message}
                    legend={legend}
                    className={classNames}
                    radios={radios}
                    checked={value}
                    onChange={(e) => onChange((e.target as HTMLInputElement).value as IValg)}
                />
            )}
        />
    );
};

export const RHFRadio = ({ name, legend, radios }: {
    name: FieldPath<FieldValues>;
    legend?: ReactNode;
    radios: RadioPanelProps[];
}) => {
    const { control, formState: { errors } } = useFormContext();

    const error: FieldError = _.get(errors, name)

    return (
        <Controller
            name={name}
            control={control}
            render={({ field: { value, onChange } }) => (
                <RadioPanelGruppe
                    name={uuid()}
                    feil={error?.message}
                    legend={legend}
                    radios={radios}
                    checked={value}
                    onChange={(e) => onChange((e.target as HTMLInputElement).value as IValg)}
                />
            )}
        />
    );
};
