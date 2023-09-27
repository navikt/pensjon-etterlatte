import { Controller, FieldError, FieldPath, FieldValues, useFormContext } from 'react-hook-form'
import {
    CheckboxGroup,
    Checkbox,
    CheckboxProps,
    CheckboxGroupProps,
    ConfirmationPanelProps,
    ConfirmationPanel,
} from '@navikt/ds-react'
import styled from 'styled-components'
import { get } from 'lodash'
import { useTranslation } from 'react-i18next'
import { getTransKey } from '../../../utils/translation'

const CheckboxGroupWrapper = styled.div<{ $inline?: boolean }>`
    .navds-checkboxes {
        ${(props) => (props.$inline ? 'display: flex; gap: 1rem;' : '')}
    }
`

const handleSelect = (array: any[], addOrRemove: any) => {
    return array?.includes(addOrRemove)
        ? array?.filter((value) => value !== addOrRemove)
        : [...(array ?? []), addOrRemove]
}

interface RHFConfirmationPanelProps extends Omit<ConfirmationPanelProps, 'onChange' | 'children' | 'checked'> {
    name: FieldPath<FieldValues>
    valgfri?: boolean
}

export function RHFConfirmationPanel({ name, valgfri, ...rest }: RHFConfirmationPanelProps) {
    const { control } = useFormContext()

    return (
        <div id={name}>
            <Controller
                name={name}
                control={control}
                rules={{ required: !valgfri }}
                render={({ field: { value, onChange } }) => (
                    <ConfirmationPanel
                        {...rest}
                        checked={value || false}
                        onChange={(e) => onChange(!!e.target.checked)}
                    />
                )}
            />
        </div>
    )
}

interface RHFCheckboksGruppeProps extends Omit<CheckboxGroupProps, 'onChange' | 'children'> {
    name: FieldPath<FieldValues>
    checkboxes: CheckboxProps[]
    required?: boolean
    inline?: boolean
}

export const RHFCheckboksGruppe = ({
    name,
    checkboxes,
    required = true,
    inline = false,
    ...rest
}: RHFCheckboksGruppeProps) => {
    const { t } = useTranslation()

    const {
        control,
        formState: { errors },
    } = useFormContext()

    const error: FieldError = get(errors, name) as FieldError
    const feilmelding = !!error ? t(getTransKey(error)) : undefined

    return (
        <CheckboxGroupWrapper id={name} $inline={inline}>
            <Controller
                name={name}
                control={control}
                rules={{ required }}
                render={({ field: { value, onChange } }) => (
                    <CheckboxGroup {...rest} error={feilmelding} defaultValue={value}>
                        {checkboxes.map((checkbox: CheckboxProps) => (
                            <Checkbox
                                key={checkbox.value as string}
                                value={checkbox.value || ''}
                                onChange={(e) =>
                                    onChange(handleSelect(value, (e.target as HTMLInputElement).value as any))
                                }
                            >
                                {checkbox.children}
                            </Checkbox>
                        ))}
                    </CheckboxGroup>
                )}
            />
        </CheckboxGroupWrapper>
    )
}
