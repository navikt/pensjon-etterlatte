import React, { ReactNode } from "react";
import { RadioPanelGruppe, RadioPanelProps } from "nav-frontend-skjema";
import { IValg } from "../../typer/Spoersmaal";
import { Controller, FieldError, useFormContext } from "react-hook-form";
import { FieldPath, FieldValues } from "react-hook-form/dist/types";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import { RegisterOptions } from "react-hook-form/dist/types/validator";
import { RadioPanelGruppeProps } from "nav-frontend-skjema/lib/radio-panel-gruppe";
import { getTransKey } from "../../utils/translation";
import styled from "styled-components";

const RadioPanelGruppeInline = styled(RadioPanelGruppe)`
 .inputPanelGruppe__inner{
  width: 100%;
  display: flex;
  justify-content: flex-start;
  column-gap: 1rem;

  .radioPanel {
    margin-bottom: 0;
    width: 100%;
    min-width: calc(33.3% - 1rem);

    @media screen and (min-width: 650px) {
      max-width: 33.3%;
    }
  }
  }
`

export const RHFSpoersmaalRadio = ({
    name,
    description,
    legend,
    vetIkke,
}: {
    name: FieldPath<FieldValues>;
    legend?: ReactNode;
    description?: ReactNode;
    vetIkke?: boolean;
}) => {
    const { t } = useTranslation();
    const defaultRadios = [
        { label: t(IValg.JA), value: IValg.JA, required: true },
        { label: t(IValg.NEI), value: IValg.NEI, required: true },
    ];

    if (vetIkke) defaultRadios.push({ label: t(IValg.VET_IKKE), value: IValg.VET_IKKE, required: true });

    return <RHFInlineRadio name={name} legend={legend} description={description} radios={defaultRadios} />;
};

export const RHFInlineRadio = ({
    name,
    legend,
    description,
    radios,
}: {
    name: FieldPath<FieldValues>;
    legend?: ReactNode;
    description?: ReactNode;
    radios: RadioPanelProps[];
}) => {
    const { t } = useTranslation();
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const error: FieldError = get(errors, name);
    const errorTekst = getTransKey(error);
    return (
        <div id={name}>
            <Controller
                name={name}
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, name } }) => (
                    <RadioPanelGruppeInline
                        name={name}
                        feil={error && t(errorTekst)}
                        legend={legend}
                        description={description}
                        radios={radios}
                        checked={value}
                        onChange={(e) => onChange((e.target as HTMLInputElement).value as IValg)}
                    />
                )}
            />
        </div>
    );
};

interface RHFRadioProps extends Omit<RadioPanelGruppeProps, "onChange"> {
    name: FieldPath<FieldValues>;
    legend?: ReactNode;
    description?: ReactNode;
    radios: RadioPanelProps[];
    rules?: Omit<RegisterOptions<FieldValues, FieldPath<FieldValues>>, "required">;
}

export const RHFRadio = ({ name, legend, description, radios, rules, ...rest }: RHFRadioProps) => {
    const { t } = useTranslation();
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const error: FieldError = get(errors, name);

    return (
        <div id={name}>
            <Controller
                name={name}
                control={control}
                rules={{ required: true, ...rules }}
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
