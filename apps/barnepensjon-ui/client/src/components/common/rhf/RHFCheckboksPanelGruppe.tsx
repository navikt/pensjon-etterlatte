import { Controller, FieldError, FieldPath, FieldValues, useFormContext } from 'react-hook-form'
import { Checkbox, CheckboxGruppe, SkjemaGruppeProps } from 'nav-frontend-skjema'
import { CheckboxProps } from 'nav-frontend-skjema/lib/checkbox'
import { get } from 'lodash'
import useTranslation from '../../../hooks/useTranslation'
import { getErrorKey } from '../../../utils/errors'
import { ConfirmationPanel } from '@navikt/ds-react'
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

interface RHFCheckboksGruppeProps extends Omit<SkjemaGruppeProps, 'onChange' | 'children'> {
    name: FieldPath<FieldValues>
    checkboxes: CheckboxProps[]
}

export function RHFCheckboksGruppe({ name, checkboxes, ...rest }: RHFCheckboksGruppeProps) {
    const { t } = useTranslation('error')

    const {
        control,
        formState: { errors },
    } = useFormContext()

    const error: FieldError = get(errors, name)
    const feilmelding = !!error ? t(getErrorKey(error)) : undefined

    return (
        <div id={name}>
            <Controller
                name={name}
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                    <CheckboxGruppe {...rest} feil={feilmelding}>
                        {checkboxes.map((checkbox: CheckboxProps) => (
                            <Checkbox
                                key={checkbox.value as string}
                                label={checkbox.label}
                                value={checkbox.value || ''}
                                required={checkbox.required}
                                checked={(value as any[])?.includes(checkbox.value)}
                                onChange={(e) =>
                                    onChange(handleSelect(value, (e.target as HTMLInputElement).value as any))
                                }
                            />
                        ))}
                    </CheckboxGruppe>
                )}
            />
        </div>
    )
}
