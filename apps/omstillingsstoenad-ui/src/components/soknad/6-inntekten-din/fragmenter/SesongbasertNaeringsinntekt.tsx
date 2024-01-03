import { useTranslation } from 'react-i18next'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import { IValg } from '../../../../typer/Spoersmaal'
import { RHFInputArea } from '../../../felles/rhf/RHFInput'

interface Props {
    type: 'norge' | 'utland'
}

const SesongbasertNaeringsinntekt = ({ type }: Props) => {
    const { t } = useTranslation()

    const { watch } = useFormContext()

    const baseUrl = `naeringsinntekt.${type}.sesongbasertNaeringsinntekt`

    const endrerInntekt = watch(`${baseUrl}.svar`)

    return (
        <>
            <SkjemaElement>
                <RHFSpoersmaalRadio
                    name={`${baseUrl}.svar`}
                    legend={t('inntektenDin.naeringsinntekt.sesongbasertNaeringsinntekt.svar')}
                    description={t('inntektenDin.naeringsinntekt.sesongbasertNaeringsinntekt.svar.beskrivelse')}
                />
            </SkjemaElement>
            {endrerInntekt === IValg.JA && (
                <SkjemaElement>
                    <RHFInputArea
                        name={`${baseUrl}.beskrivelse`}
                        label={t('inntektenDin.naeringsinntekt.sesongbasertNaeringsinntekt.beskrivelse')}
                        maxLength={200}
                        className={'width-50'}
                    />
                </SkjemaElement>
            )}
        </>
    )
}

export default SesongbasertNaeringsinntekt
