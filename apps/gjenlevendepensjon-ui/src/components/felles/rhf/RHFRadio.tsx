import React, { ReactNode } from "react";
import { IValg } from "../../../typer/Spoersmaal";
import { Controller, FieldError, useFormContext } from "react-hook-form";
import { FieldPath, FieldValues } from "react-hook-form/dist/types";
import { get } from "lodash";
import { useTranslation } from "react-i18next";
import { RegisterOptions } from "react-hook-form/dist/types/validator";
import { getTransKey } from "../../../utils/translation";
import styled from "styled-components";
import { Radio, RadioGroup, RadioGroupProps, RadioProps } from '@navikt/ds-react'
import {SkjemaElement} from "../SkjemaElement";

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
        { children: t(IValg.JA), value: IValg.JA, required: true },
        { children: t(IValg.NEI), value: IValg.NEI, required: true },
    ];

    if (vetIkke) defaultRadios.push({ children: t(IValg.VET_IKKE), value: IValg.VET_IKKE, required: true });

    return <RHFInlineRadio name={name} legend={legend} description={description}>{defaultRadios}</RHFInlineRadio>;
};

const InlineRadioPanelGroup = styled(RadioGroup)`
    .navds-radio-buttons {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        column-gap: 1rem;

        .radioBorder {
            margin-bottom: 0 !important;
            width: 100%;
            min-width: calc(33.3% - 1rem);

            @media screen and (min-width: 650px) {
                max-width: 33.3%;
            }
        }
    }
`

export const RHFInlineRadio = ({
    name,
    legend,
    description,
    children,
}: {
    name: FieldPath<FieldValues>;
    legend?: ReactNode;
    description?: ReactNode;
    children: RadioProps[];
}) => {
    const { t } = useTranslation();
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const error: FieldError = get(errors, name) as FieldError;
    const errorTekst = getTransKey(error);
    return (
        <div id={name}>
            <Controller
                name={name}
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, name } }) => (
                    <InlineRadioPanelGroup
                        name={name}
                        error={error && t(errorTekst)}
                        legend={legend}
                        description={description}
                        value={value ?? ''}
                        onChange={(val) => onChange(val as IValg)}
                    >
                        {children.map((child, index) => (
                                <Radio
                                        key={index}
                                        value={child.value}
                                        className={'radioBorder'}
                                >
                                    {child.children}
                                </Radio>
                        ))}
                    </InlineRadioPanelGroup>
                )}
            />
        </div>
    );
};

interface RHFRadioProps extends Omit<RadioGroupProps, "onChange" | "children"> {
    name: FieldPath<FieldValues>;
    description?: ReactNode;
    children: RadioProps[];
    rules?: Omit<RegisterOptions<FieldValues, FieldPath<FieldValues>>, "required">;
}

export const RHFRadio = ({ name, legend, description, children, rules, ...rest }: RHFRadioProps) => {
    const { t } = useTranslation();
    const {
        control,
        formState: { errors },
    } = useFormContext();

    const error: FieldError = get(errors, name) as FieldError;

    return (
        <div id={name}>
            <SkjemaElement>
                <Controller
                    name={name}
                    control={control}
                    rules={{ required: true, ...rules }}
                    render={({ field: { value, onChange, name } }) => (
                        <RadioGroup
                            {...rest}
                            name={name}
                            error={error && t(`feil.${error.ref?.name}.${error.type}`)}
                            description={description}
                            legend={legend}
                            value={value ?? ''}
                            onChange={(val) => onChange(val as IValg)}
                        >
                            {children.map((child, index) => (
                                    <Radio
                                            key={index}
                                            value={child.value}
                                            className={'radioBorder'}
                                    >
                                        {child.children}
                                    </Radio>
                            ))}
                        </RadioGroup>
                    )}
                />
            </SkjemaElement>
        </div>
    );
};
