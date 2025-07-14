import { Box } from '@navikt/ds-react'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { EndringAvInntektGrunn } from '../../../../typer/inntekt'
import { IValg } from '../../../../typer/Spoersmaal'
import { RHFInputArea } from '../../../felles/rhf/RHFInput'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import { RHFSelect } from '../../../felles/rhf/RHFSelect'

interface Props {
    type: 'loennsinntekt' | 'naeringsinntekt'
}

const EndringInntekt = ({ type }: Props) => {
    const { t } = useTranslation()

    const { watch } = useFormContext()

    const baseUrl = `${type}.forventerEndringAvInntekt`

    const endrerInntekt = watch(`${baseUrl}.svar`)
    const endringAvInntektGrunn = watch(`${baseUrl}.grunn`)

    const endringAvInntektGrunner = Object.values(EndringAvInntektGrunn).map((value) => {
        return { label: t(value), value: value }
    })

    return (
        <>
            <Box marginBlock="4">
                <RHFSpoersmaalRadio
                    name={`${baseUrl}.svar`}
                    legend={t('inntektenDin.forventerEndringAvInntekt.svar')}
                    vetIkke
                />
            </Box>
            {endrerInntekt === IValg.JA && (
                <Box marginBlock="4">
                    <RHFSelect
                        name={`${baseUrl}.grunn`}
                        label={t('inntektenDin.forventerEndringAvInntekt.grunn')}
                        selectOptions={[
                            {
                                label: t('felles.velg'),
                                value: '',
                            },
                        ].concat(endringAvInntektGrunner)}
                    />
                </Box>
            )}
            {endringAvInntektGrunn === EndringAvInntektGrunn.annenGrunn && (
                <Box marginBlock="4">
                    <RHFInputArea
                        name={`${baseUrl}.annenGrunn`}
                        label={t('inntektenDin.forventerEndringAvInntekt.annenGrunn')}
                        maxLength={200}
                        className={'width-50'}
                    />
                </Box>
            )}
        </>
    )
}

export default EndringInntekt
