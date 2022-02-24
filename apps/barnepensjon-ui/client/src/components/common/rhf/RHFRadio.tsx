import React, { ReactNode } from 'react'
import { RadioPanelGruppe, RadioPanelProps } from 'nav-frontend-skjema'
import { Controller, FieldError, useFormContext } from 'react-hook-form'
import { FieldPath, FieldValues } from 'react-hook-form/dist/types'
import { get } from 'lodash'
import { RegisterOptions } from 'react-hook-form/dist/types/validator'
import { RadioPanelGruppeProps } from 'nav-frontend-skjema/lib/radio-panel-gruppe'
import { JaNeiVetIkke } from '../../../api/dto/FellesOpplysninger'
import useTranslation from '../../../hooks/useTranslation'
import { getErrorKey } from '../../../utils/errors'
import styled from 'styled-components'

export const RHFGeneralQuestionRadio = ({
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
        { label: t(JaNeiVetIkke.JA), value: JaNeiVetIkke.JA, required: true },
        { label: t(JaNeiVetIkke.NEI), value: JaNeiVetIkke.NEI, required: true },
    ]

    if (vetIkke) defaultRadios.push({ label: t(JaNeiVetIkke.VET_IKKE), value: JaNeiVetIkke.VET_IKKE, required: true })

    return <RHFInlineRadio name={name} legend={legend} description={description} radios={defaultRadios} />
}

const InlineRadioPanelGroup = styled(RadioPanelGruppe)`
    .inputPanelGruppe__inner {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        column-gap: 1rem;

        .radioPanel {
            margin-bottom: 0;
            width: 100%;
            min-width: calc(33.3% - 1rem);

            @media screen and (min-width: 650px) {
                max-width: 33.3%;
            }
        }
    }
`

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
                rules={{ required: true }}
                render={({ field: { value, onChange, name } }) => (
                    <InlineRadioPanelGroup
                        name={name}
                        feil={errorMsg}
                        legend={legend}
                        description={description}
                        radios={radios}
                        checked={value}
                        onChange={(e) => onChange((e.target as HTMLInputElement).value as JaNeiVetIkke)}
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

export function RHFRadio({ name, legend, description, radios, rules, ...rest }: RHFRadioProps) {
    const { t } = useTranslation('radiobuttons')
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
                render={({ field: { value, onChange, name } }) => (
                    <RadioPanelGruppe
                        {...rest}
                        name={name}
                        feil={errorMsg}
                        description={description}
                        legend={legend}
                        radios={radios}
                        checked={value}
                        onChange={(e) => onChange((e.target as HTMLInputElement).value as JaNeiVetIkke)}
                    />
                )}
            />
        </div>
    )
}
