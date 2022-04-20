import React, { SelectHTMLAttributes, ReactNode } from 'react'
import { Select } from 'nav-frontend-skjema'
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

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    name: FieldPath<FieldValues>
    label?: ReactNode
    selectOptions: SelectOption[]
    rules?: Omit<RegisterOptions<FieldValues, FieldPath<FieldValues>>, 'required'>
}

export const RHFSelect = ({ name, label, selectOptions, rules, ...rest }: SelectProps) => {
    const { t } = useTranslation('error')

    const {
        control,
        formState: { errors },
    } = useFormContext()

    const error: FieldError = get(errors, name)
    const errorMsg = !!error ? t(getErrorKey(error)) : undefined

    return (
        <div id={name}>
            <Controller
                name={name}
                control={control}
                rules={{ required: true, ...rules }}
                render={({ field: { value, onChange, onBlur } }) => (
                    <Select
                        {...rest}
                        value={value || ''}
                        selected={value || ''}
                        onChange={(e) => onChange((e.target as HTMLSelectElement).value)}
                        onBlur={onBlur}
                        label={label}
                        bredde={'l'}
                        feil={errorMsg}
                    >
                        {selectOptions.map((option) => (
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
