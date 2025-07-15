import { Box, Heading } from '@navikt/ds-react'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { IInntekt, InntektEllerUtbetaling } from '../../../../typer/inntekt'
import { RHFCheckboksGruppe } from '../../../felles/rhf/RHFCheckboksPanelGruppe'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'

const InntektViaYtelserFraNAV = () => {
    const { t } = useTranslation()
    const { watch } = useFormContext<IInntekt>()

    const ytelser = watch('inntektViaYtelserFraNAV.ytelser')

    return (
        <>
            <Box marginBlock="0 12">
                <Box marginBlock="4">
                    <Heading size={'medium'}>{t('inntektenDin.inntektViaYtelserFraNAV.tittel')}</Heading>
                </Box>

                <Box marginBlock="4">
                    <RHFCheckboksGruppe
                        name={'inntektViaYtelserFraNAV.ytelser'}
                        legend={t('inntektenDin.inntektViaYtelserFraNAV.ytelser')}
                        checkboxes={Object.values(InntektEllerUtbetaling).map((value) => {
                            return { children: t(value), value, required: true }
                        })}
                    />
                </Box>

                {ytelser?.includes(InntektEllerUtbetaling.arbeidsavklaringspenger) && (
                    <Box marginBlock="4">
                        <RHFSpoersmaalRadio
                            name={`inntektViaYtelserFraNAV.aktivitetsplan.svar`}
                            legend={t('inntektenDin.inntektViaYtelserFraNAV.aktivitetsplan.svar')}
                        />
                    </Box>
                )}
            </Box>
        </>
    )
}

export default InntektViaYtelserFraNAV
