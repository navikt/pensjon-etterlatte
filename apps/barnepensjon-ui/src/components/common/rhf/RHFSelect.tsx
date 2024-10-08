import React from 'react'
import { Select, SelectProps } from '@navikt/ds-react'
import { Controller, FieldError, useFormContext } from 'react-hook-form'
import { FieldPath, FieldValues } from 'react-hook-form/dist/types'
import { get } from 'lodash'
import { RegisterOptions } from 'react-hook-form/dist/types/validator'
import { v4 as uuid } from 'uuid'
import useTranslation from '../../../hooks/useTranslation'
import { getErrorKey } from '../../../utils/errors'

interface SelectOption {
    value?: string
    label: string
}

interface RHFProps extends Omit<SelectProps, 'name' | 'children'> {
    name: FieldPath<FieldValues>
    children: SelectOption[]
    rules?: Omit<RegisterOptions<FieldValues, FieldPath<FieldValues>>, 'required'>
}

export const RHFSelect = ({ name, label, children, rules, required = true, ...rest }: RHFProps) => {
    const { t } = useTranslation('error')

    const {
        control,
        formState: { errors },
    } = useFormContext()

    const error: FieldError = get(errors, name) as FieldError
    const errorMsg = !!error ? t(getErrorKey(error)) : undefined
    const labelWithOptional = `${label} ${required ? '' : `(${t('optional', { ns: 'common' })})`}`

    return (
        <div id={name}>
            <Controller
                name={name}
                control={control}
                rules={{ required, ...rules }}
                render={({ field: { value, onChange, onBlur } }) => (
                    <Select
                        {...rest}
                        value={value || ''}
                        onChange={(e) => onChange((e.target as HTMLSelectElement).value)}
                        onBlur={onBlur}
                        label={labelWithOptional}
                        error={errorMsg}
                    >
                        {children.map((option) => (
                            <option key={uuid()} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Select>
                )}
            />
        </div>
    )
}
