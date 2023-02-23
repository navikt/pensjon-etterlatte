import { Controller, FieldError, FieldPath, FieldValues, useFormContext } from 'react-hook-form'
import { get } from 'lodash'
import useTranslation from '../../../hooks/useTranslation'
import { getErrorKey } from '../../../utils/errors'
import { ConfirmationPanel, CheckboxGroup, Checkbox, CheckboxProps, CheckboxGroupProps } from '@navikt/ds-react'
import { ConfirmationPanelProps } from '@navikt/ds-react/esm/form/ConfirmationPanel'

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
}

export function RHFCheckboksGruppe({ name, checkboxes, ...rest }: RHFCheckboksGruppeProps) {
    const { t } = useTranslation('error')

    const {
        control,
        formState: { errors },
    } = useFormContext()

    const error: FieldError = get(errors, name) as FieldError
    const feilmelding = !!error ? t(getErrorKey(error)) : undefined

    return (
        <div id={name}>
            <Controller
                name={name}
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                    <CheckboxGroup {...rest} error={feilmelding}>
                        {checkboxes.map((checkbox: CheckboxProps) => (
                            <Checkbox
                                key={checkbox.value as string}
                                value={checkbox.value || ''}
                                required={checkbox.required}
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
        </div>
    )
}
