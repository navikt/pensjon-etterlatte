import { Radio, RadioGroup, RadioGroupProps, RadioProps } from '@navikt/ds-react'
import { get } from 'lodash'
import React, { ReactNode } from 'react'
import { Controller, FieldError, useFormContext } from 'react-hook-form'
import { FieldPath, FieldValues } from 'react-hook-form/dist/types'
import { RegisterOptions } from 'react-hook-form/dist/types/validator'
import { JaNeiVetIkke } from '../../../api/dto/FellesOpplysninger'
import useTranslation from '../../../hooks/useTranslation'
import { getErrorKey } from '../../../utils/errors'

export const RHFGeneralQuestionRadio = ({
    id,
    name,
    description,
    legend,
    vetIkke,
}: {
    id?: string
    name: FieldPath<FieldValues>
    legend?: ReactNode
    description?: ReactNode
    vetIkke?: boolean
    inline?: boolean
}) => {
    const { t } = useTranslation('radiobuttons')
    const defaultRadios = [
        { children: t(JaNeiVetIkke.JA), value: JaNeiVetIkke.JA, required: true },
        { children: t(JaNeiVetIkke.NEI), value: JaNeiVetIkke.NEI, required: true },
    ]

    if (vetIkke)
        defaultRadios.push({ children: t(JaNeiVetIkke.VET_IKKE), value: JaNeiVetIkke.VET_IKKE, required: true })

    return <RHFRadio id={id} name={name} legend={legend} description={description} children={defaultRadios} />
}

interface RHFRadioProps extends Omit<RadioGroupProps, 'onChange' | 'children'> {
    name: FieldPath<FieldValues>
    description?: ReactNode
    children: RadioProps[]
    rules?: Omit<RegisterOptions<FieldValues, FieldPath<FieldValues>>, 'required'>
}

export function RHFRadio({ name, legend, description, children, rules, ...rest }: RHFRadioProps) {
    const { t } = useTranslation('error')
    const {
        control,
        formState: { errors },
    } = useFormContext()

    const error: FieldError = get(errors, name) as FieldError
    const errorMsg = !!error ? t(getErrorKey(error)) : undefined

    return (
        <div id={name}>
            <Controller
                name={name}
                control={control}
                rules={{ required: true, ...rules }}
                render={({ field: { value, onChange, name } }) => (
                    <RadioGroup
                        {...rest}
                        name={name}
                        error={errorMsg}
                        description={description}
                        legend={legend}
                        value={value ?? ''}
                        onChange={(val) => onChange(val)}
                    >
                        {children.map((child, index) => (
                            <Radio
                                key={index}
                                value={child.value}
                                children={child.children}
                                className={'radioBorder'}
                            />
                        ))}
                    </RadioGroup>
                )}
            />
        </div>
    )
}
