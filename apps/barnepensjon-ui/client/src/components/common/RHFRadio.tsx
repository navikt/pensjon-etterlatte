import React, { ReactNode } from 'react'
import { RadioPanelGruppe, RadioPanelProps } from 'nav-frontend-skjema'
import { IChoice } from '../../types/Question'
import { Controller, FieldError, useFormContext } from 'react-hook-form'
import { FieldPath, FieldValues } from 'react-hook-form/dist/types'
import { get } from 'lodash'
import useTranslation from '../../hooks/useTranslation'
import { RegisterOptions } from 'react-hook-form/dist/types/validator'
import { RadioPanelGruppeProps } from 'nav-frontend-skjema/lib/radio-panel-gruppe'
import { getTransKey } from '../../utils/translation'

export const RHFSpoersmaalRadio = ({
    name,
    description,
    legend,
    vetIkke,
}: {
    name: FieldPath<FieldValues>
    legend?: ReactNode
    description?: ReactNode
    vetIkke?: boolean
}) => {
    const { t } = useTranslation('radiobuttons')
    const defaultRadios = [
        { label: t(IChoice.JA), value: IChoice.JA, required: true },
        { label: t(IChoice.NEI), value: IChoice.NEI, required: true },
    ]

    if (vetIkke) defaultRadios.push({ label: t(IChoice.VET_IKKE), value: IChoice.VET_IKKE, required: true })

    return <RHFInlineRadio name={name} legend={legend} description={description} radios={defaultRadios} />
}

export const RHFInlineRadio = ({
    name,
    legend,
    description,
    radios,
}: {
    name: FieldPath<FieldValues>
    legend?: ReactNode
    description?: ReactNode
    radios: RadioPanelProps[]
}) => {
    const { t } = useTranslation()
    const {
        control,
        formState: { errors },
    } = useFormContext()

    const error: FieldError = get(errors, name)
    const errorTekst = getTransKey(error)
    return (
        <div id={name}>
            <Controller
                name={name}
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange, name } }) => (
                    <RadioPanelGruppe
                        name={name}
                        feil={error && t(errorTekst)}
                        legend={legend}
                        className={'inline'}
                        description={description}
                        radios={radios}
                        checked={value}
                        onChange={(e) => onChange((e.target as HTMLInputElement).value as IChoice)}
                    />
                )}
            />
        </div>
    )
}

interface RHFRadioProps extends Omit<RadioPanelGruppeProps, 'onChange'> {
    name: FieldPath<FieldValues>
    legend?: ReactNode
    description?: ReactNode
    radios: RadioPanelProps[]
    rules?: Omit<RegisterOptions<FieldValues, FieldPath<FieldValues>>, 'required'>
}

export const RHFRadio = ({ name, legend, description, radios, rules, ...rest }: RHFRadioProps) => {
    const { t } = useTranslation()
    const {
        control,
        formState: { errors },
    } = useFormContext()

    const error: FieldError = get(errors, name)

    return (
        <div id={name}>
            <Controller
                name={name}
                control={control}
                rules={{ required: true, ...rules }}
                render={({ field: { value, onChange, name } }) => (
                    <RadioPanelGruppe
                        {...rest}
                        name={name}
                        feil={error && t(`feil.${error.ref?.name}.${error.type}`)}
                        description={description}
                        legend={legend}
                        radios={radios}
                        checked={value}
                        onChange={(e) => onChange((e.target as HTMLInputElement).value as IChoice)}
                    />
                )}
            />
        </div>
    )
}
