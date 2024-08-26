import React from 'react'
import { FieldPath, FieldValues } from 'react-hook-form/dist/types'
import { RegisterOptions } from 'react-hook-form/dist/types/validator'
import { ComboboxProps, UNSAFE_Combobox } from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'
import { Controller, FieldError, useFormContext } from 'react-hook-form'
import { get } from 'lodash'
import { getTransKey } from '~utils/translation'

interface RHFProps extends Omit<ComboboxProps, 'name'> {
    name: FieldPath<FieldValues>
    rules?: Omit<RegisterOptions<FieldValues, FieldPath<FieldValues>>, 'required'>
}

export const RHFCombobox = ({ name, label, options, rules, required = true, ...rest }: RHFProps) => {
    const { t } = useTranslation()

    const {
        control,
        formState: { errors },
    } = useFormContext()

    const error: FieldError = get(errors, name) as FieldError
    const errorMsg = !!error ? t(getTransKey(error)) : undefined
    const labelWithOptional = required ? `${label} (${t('felles.valgfri')})` : label

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
