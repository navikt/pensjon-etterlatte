import React from 'react'
import { ComboboxProps, UNSAFE_Combobox } from '@navikt/ds-react'
import { FieldPath, FieldValues } from 'react-hook-form/dist/types'
import { RegisterOptions } from 'react-hook-form/dist/types/validator'
import useTranslation from '~hooks/useTranslation'
import { Controller, FieldError, useFormContext } from 'react-hook-form'
import { get } from 'lodash'
import { getErrorKey } from '~utils/errors'

interface RHFProps extends Omit<ComboboxProps, 'name'> {
    name: FieldPath<FieldValues>
    rules?: Omit<RegisterOptions<FieldValues, FieldPath<FieldValues>>, 'required'>
}

export const RHFCombobox = ({ name, label, options, rules, required = true, ...rest }: RHFProps) => {
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
                    <UNSAFE_Combobox
                        {...rest}
                        label={labelWithOptional}
                        options={options}
                        selectedOptions={value ? [value] : ['']}
                        onToggleSelected={(option, isSelected) => {
                            isSelected ? onChange(option) : onChange('')
                        }}
                        onBlur={onBlur}
                        error={errorMsg}
                        shouldAutocomplete
                    />
                )}
            />
        </div>
    )
}
