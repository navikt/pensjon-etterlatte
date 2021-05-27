import React, { ReactNode } from "react";
import { RadioPanelGruppe, RadioPanelProps } from "nav-frontend-skjema";
import IValg from "../../typer/IValg";
import { v4 as uuid } from "uuid";
import { Controller, FieldError, useFormContext } from "react-hook-form";
import { FieldPath, FieldValues } from "react-hook-form/dist/types";
import { get } from "lodash";
import classnames from "classnames";
import { useTranslation } from "react-i18next";
import { RegisterOptions } from "react-hook-form/dist/types/validator";

export const RHFToValgRadio = ({ name, legend, overrideRadios }: {
    name: FieldPath<FieldValues>;
    legend?: ReactNode;
    overrideRadios?: RadioPanelProps[];
}) => {
    const { t } = useTranslation();
    const { control, formState: { errors } } = useFormContext();

    const error: FieldError = get(errors, name)

    let radios: RadioPanelProps[] = overrideRadios || [
        { label: IValg.JA, value: IValg.JA },
        { label: IValg.NEI, value: IValg.NEI },
    ];

    const classNames = classnames(radios.length === 2 && "to-valg-radio")

    return (
        <div id={name}>
            <Controller
                name={name}
                control={control}
                rules={{required: true}}
                render={({ field: { value, onChange } }) => (
                    <RadioPanelGruppe
                        name={uuid()}
                        feil={error && t(`feil.${error.ref?.name}.${error.type}`)}
                        legend={legend}
                        className={classNames}
                        radios={radios}
                        checked={value}
                        onChange={(e) => onChange((e.target as HTMLInputElement).value as IValg)}
                    />
                )}
            />
        </div>
    );
};

export const RHFRadio = ({ name, legend, radios, rules }: {
    name: FieldPath<FieldValues>;
    legend?: ReactNode;
    radios: RadioPanelProps[];
    rules?: Omit<RegisterOptions<FieldValues, FieldPath<FieldValues>>, 'required'>;
}) => {
    const { t } = useTranslation();
    const { control, formState: { errors } } = useFormContext();

    const error: FieldError = get(errors, name)

    return (
        <div id={name}>
            <Controller
                name={name}
                control={control}
                rules={{required: true, ...rules}}
                render={({ field: { value, onChange } }) => (
                    <RadioPanelGruppe
                        name={uuid()}
                        feil={error && t(`feil.${error.ref?.name}.${error.type}`)}
                        legend={legend}
                        radios={radios}
                        checked={value}
                        onChange={(e) => onChange((e.target as HTMLInputElement).value as IValg)}
                    />
                )}
            />
        </div>
    );
};
