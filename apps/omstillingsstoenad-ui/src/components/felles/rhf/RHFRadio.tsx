import React, { ReactNode } from 'react'
import { IValg } from '../../../typer/Spoersmaal'
import { Controller, FieldError, useFormContext } from 'react-hook-form'
import { FieldPath, FieldValues } from 'react-hook-form/dist/types'
import { get } from 'lodash'
import { useTranslation } from 'react-i18next'
import { RegisterOptions } from 'react-hook-form/dist/types/validator'
import { getTransKey } from '../../../utils/translation'
import styled from 'styled-components'
import { Radio, RadioGroup, RadioGroupProps, RadioProps } from '@navikt/ds-react'
import { SkjemaElement } from '../SkjemaElement'

export const RHFSpoersmaalRadio = ({
    name,
    description,
    legend,
    vetIkke,
}: {
    name: FieldPath<FieldValues>
    legend?: ReactNode
    description?: ReactNode
    vetIkke?: boolean
}) => {
    const { t } = useTranslation()
    const defaultRadios = [
        { children: t(IValg.JA), value: IValg.JA, required: true },
        { children: t(IValg.NEI), value: IValg.NEI, required: true },
    ]

    if (vetIkke) defaultRadios.push({ children: t(IValg.VET_IKKE), value: IValg.VET_IKKE, required: true })

    return (
        <RHFRadio name={name} legend={legend} description={description}>
            {defaultRadios}
        </RHFRadio>
    )
}

interface RHFRadioProps extends Omit<RadioGroupProps, 'onChange' | 'children'> {
    name: FieldPath<FieldValues>
    description?: ReactNode
    children: RadioProps[]
    rules?: Omit<RegisterOptions<FieldValues, FieldPath<FieldValues>>, 'required'>
}

export const RHFRadio = ({ name, legend, description, children, rules, ...rest }: RHFRadioProps) => {
    const { t } = useTranslation()
    const {
        control,
        formState: { errors },
    } = useFormContext()

    const error: FieldError = get(errors, name) as FieldError

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
                                <Radio key={index} value={child.value} className={'radioBorder'}>
                                    {child.children}
                                </Radio>
                            ))}
                        </RadioGroup>
                    )}
                />
            </SkjemaElement>
        </div>
    )
}
