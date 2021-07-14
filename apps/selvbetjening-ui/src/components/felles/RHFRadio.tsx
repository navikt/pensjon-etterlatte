import React, { ReactNode } from "react";
import { RadioPanelGruppe, RadioPanelProps } from "nav-frontend-skjema";
import { IValg } from "../../typer/Spoersmaal";
import { Controller, FieldError, useFormContext } from "react-hook-form";
import { FieldPath, FieldValues } from "react-hook-form/dist/types";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import { RegisterOptions } from "react-hook-form/dist/types/validator";
import { RadioPanelGruppeProps } from "nav-frontend-skjema/lib/radio-panel-gruppe";
import HvorforSpoerVi from "./HvorforSpoerVi";

/* TODO: Rename to RHFSpoersmaalRadio */
export const RHFToValgRadio = ({ name, hjelpetekst, legend, vetIkke }: {
    name: FieldPath<FieldValues>;
    legend?: ReactNode;
    hjelpetekst?: string;
    vetIkke?: boolean;
}) => {
    const defaultRadios = [
        { label: IValg.JA, value: IValg.JA },
        { label: IValg.NEI, value: IValg.NEI },
    ];

    if (vetIkke) defaultRadios.push({ label: IValg.VET_IKKE, value: IValg.VET_IKKE })

    return (
        <RHFInlineRadio
            name={name}
            legend={legend}
            hjelpetekst={hjelpetekst}
            radios={defaultRadios}
        />
    )
}

export const RHFInlineRadio = ({ name, legend, hjelpetekst, radios }: {
    name: FieldPath<FieldValues>;
    legend?: ReactNode;
    hjelpetekst?: string;
    radios: RadioPanelProps[];
}) => {
    const { t } = useTranslation();
    const { control, formState: { errors } } = useFormContext();

    const error: FieldError = get(errors, name)

    return (
        <div id={name}>
            <Controller
                name={name}
                control={control}
                rules={{required: true}}
                render={({ field: { value, onChange, name } }) => (
                    <RadioPanelGruppe
                        name={name}
                        feil={error && t(`feil.${error.ref?.name}.${error.type}`)}
                        legend={legend}
                        className={"inline"}
                        description={hjelpetekst && (<HvorforSpoerVi>{hjelpetekst}</HvorforSpoerVi>)}
                        radios={radios}
                        checked={value}
                        onChange={(e) => onChange((e.target as HTMLInputElement).value as IValg)}
                    />
                )}
            />
        </div>
    );
};

interface RHFRadioProps extends Omit<RadioPanelGruppeProps, 'onChange'> {
    name: FieldPath<FieldValues>;
    legend?: ReactNode;
    hjelpetekst?: string;
    radios: RadioPanelProps[];
    rules?: Omit<RegisterOptions<FieldValues, FieldPath<FieldValues>>, 'required'>;
}

export const RHFRadio = ({ name, legend, hjelpetekst, radios, rules, ...rest }: RHFRadioProps) => {
    const { t } = useTranslation();
    const { control, formState: { errors } } = useFormContext();

    const error: FieldError = get(errors, name)

    const description = hjelpetekst && (
        <HvorforSpoerVi>{hjelpetekst}</HvorforSpoerVi>
    );

    return (
        <div id={name}>
            <Controller
                name={name}
                control={control}
                rules={{required: true, ...rules}}
                render={({ field: { value, onChange, name } }) => (
                    <RadioPanelGruppe
                        {...rest}
                        name={name}
                        feil={error && t(`feil.${error.ref?.name}.${error.type}`)}
                        description={description}
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
