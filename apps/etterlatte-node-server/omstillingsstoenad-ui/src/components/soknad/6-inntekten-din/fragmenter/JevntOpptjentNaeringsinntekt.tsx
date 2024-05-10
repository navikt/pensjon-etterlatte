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

const JevntOpptjentNaeringsinntekt = ({ type }: Props) => {
    const { t } = useTranslation()

    const { watch } = useFormContext()

    const baseUrl = `naeringsinntekt.${type}.jevntOpptjentNaeringsinntekt`

    const endrerInntekt = watch(`${baseUrl}.svar`)

    return (
        <>
            <SkjemaElement>
                <RHFSpoersmaalRadio
                    name={`${baseUrl}.svar`}
                    legend={t('inntektenDin.naeringsinntekt.jevntOpptjentNaeringsinntekt.svar')}
                />
            </SkjemaElement>
            {endrerInntekt === IValg.NEI && (
                <SkjemaElement>
                    <RHFInputArea
                        name={`${baseUrl}.beskrivelse`}
                        label={t('inntektenDin.naeringsinntekt.jevntOpptjentNaeringsinntekt.beskrivelse')}
                        description={t(
                            'inntektenDin.naeringsinntekt.jevntOpptjentNaeringsinntekt.beskrivelse.beskrivelse'
                        )}
                        maxLength={1000}
                        className={'width-50'}
                        resize={'vertical'}
                    />
                </SkjemaElement>
            )}
        </>
    )
}

export default JevntOpptjentNaeringsinntekt
