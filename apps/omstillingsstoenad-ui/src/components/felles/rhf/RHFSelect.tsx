import React from 'react'
import { Select, SelectProps } from '@navikt/ds-react'
import { Controller, FieldError, useFormContext } from 'react-hook-form'
import { FieldPath, FieldValues } from 'react-hook-form/dist/types'
import { get } from 'lodash'
import { RegisterOptions } from 'react-hook-form/dist/types/validator'
import { useTranslation } from 'react-i18next'
import { v4 as uuid } from 'uuid'
import { getTransKey } from '../../../utils/translation'
import styled from 'styled-components'

const SelectSize = styled.div<{$size?: number}>`
  max-width: ${props => props.$size ? `${props.$size}rem`  : '22rem'};
`

interface SelectOption {
    value?: string
    label: string
}

interface RHFProps extends Omit<SelectProps, 'name' | 'children'> {
    name: FieldPath<FieldValues>
    selectOptions: SelectOption[]
    rules?: Omit<RegisterOptions<FieldValues, FieldPath<FieldValues>>, 'required'>
    bredde?: number
    valgfri?: boolean
}

export const RHFSelect = ({ name, label, selectOptions, rules, bredde, valgfri = false, ...rest }: RHFProps) => {
    const { t } = useTranslation()

    const {
        control,
        formState: { errors },
    } = useFormContext()

    const error: FieldError = get(errors, name) as FieldError
    const feilmelding = !!error ? t(getTransKey(error)) : undefined

    return (
        <SelectSize $size={bredde} id={name}>
            <Controller
                name={name}
                control={control}
                rules={{ required: !valgfri, ...rules }}
                render={({ field: { value, onChange, onBlur } }) => (
                    <Select
                        {...rest}
                        value={value || ''}
                        onChange={(e) => onChange((e.target as HTMLSelectElement).value)}
                        onBlur={onBlur}
                        label={valgfri ? `${label} (${t('felles.valgfri')})` : label}
                        error={feilmelding}
                    >
                        {selectOptions.map((option) => (
                            <option key={uuid()} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Select>
                )}
            />
        </SelectSize>
    )
}
