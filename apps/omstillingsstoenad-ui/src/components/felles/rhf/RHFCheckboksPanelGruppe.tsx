import {
    Checkbox,
    CheckboxGroup,
    CheckboxGroupProps,
    CheckboxProps,
    ConfirmationPanel,
    ConfirmationPanelProps,
} from '@navikt/ds-react'
import { get } from 'lodash'
import { Controller, FieldError, FieldPath, FieldValues, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { getTransKey } from '../../../utils/translation'

// biome-ignore lint/suspicious/noExplicitAny: gammel kode, venter med å fikse
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
                        onChange={(e) => onChange(e.target.checked)}
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
}

export const RHFCheckboksGruppe = ({ name, checkboxes, required = true, ...rest }: RHFCheckboksGruppeProps) => {
    const { t } = useTranslation()

    const {
        control,
        formState: { errors },
    } = useFormContext()

    const error: FieldError = get(errors, name) as FieldError
    const feilmelding = !!error ? t(getTransKey(error)) : undefined

    return (
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
                            onChange={(e) => onChange(handleSelect(value, (e.target as HTMLInputElement).value))}
                        >
                            {checkbox.children}
                        </Checkbox>
                    ))}
                </CheckboxGroup>
            )}
        />
    )
}

interface RHFCheckboksProps {
    name: FieldPath<FieldValues>
    label: string
    required?: boolean
    legend?: string
}

export function RHFCheckboks({ name, label, required, legend }: RHFCheckboksProps) {
    const { t } = useTranslation('error')

    const {
        control,
        formState: { errors },
    } = useFormContext()

    const error: FieldError = get(errors, name) as FieldError
    const feilmelding = !!error ? t(getTransKey(error)) : undefined

    return (
        <div id={name}>
            <Controller
                name={name}
                control={control}
                rules={{ required }}
                render={({ field: { value, onChange } }) => (
                    <CheckboxGroup legend={legend ?? ''} hideLegend error={feilmelding} defaultValue={[value]}>
                        <Checkbox
                            key={name}
                            value={value || false}
                            onChange={(e) => onChange((e.target as HTMLInputElement).checked)}
                        >
                            {label}
                        </Checkbox>
                    </CheckboxGroup>
                )}
            />
        </div>
    )
}
