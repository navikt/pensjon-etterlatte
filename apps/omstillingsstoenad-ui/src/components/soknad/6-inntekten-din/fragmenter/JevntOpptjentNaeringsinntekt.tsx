import { Box } from '@navikt/ds-react'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { IValg } from '../../../../typer/Spoersmaal'
import { RHFInputArea } from '../../../felles/rhf/RHFInput'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'

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
            <Box marginBlock="4">
                <RHFSpoersmaalRadio
                    name={`${baseUrl}.svar`}
                    legend={t('inntektenDin.naeringsinntekt.jevntOpptjentNaeringsinntekt.svar')}
                />
            </Box>
            {endrerInntekt === IValg.NEI && (
                <Box marginBlock="4">
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
                </Box>
            )}
        </>
    )
}

export default JevntOpptjentNaeringsinntekt
