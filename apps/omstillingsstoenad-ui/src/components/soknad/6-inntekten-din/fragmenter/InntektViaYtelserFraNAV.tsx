import React from 'react'
import { useTranslation } from 'react-i18next'
import { Heading } from '@navikt/ds-react'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { IInntekt, InntektEllerUtbetaling } from '../../../../typer/inntekt'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { RHFCheckboksGruppe } from '../../../felles/rhf/RHFCheckboksPanelGruppe'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import { useFormContext } from 'react-hook-form'

const InntektViaYtelserFraNAV = () => {
    const { t } = useTranslation()
    const { watch } = useFormContext<IInntekt>()

    const ytelser = watch('inntektViaYtelserFraNAV.ytelser')

    return (
        <>
            <SkjemaGruppe>
                <SkjemaElement>
                    <Heading size={'medium'}>{t('inntektenDin.inntektViaYtelserFraNAV.tittel')}</Heading>
                </SkjemaElement>

                <SkjemaElement>
                    <RHFCheckboksGruppe
                        name={'inntektViaYtelserFraNAV.ytelser'}
                        legend={t('inntektenDin.inntektViaYtelserFraNAV.ytelser')}
                        checkboxes={Object.values(InntektEllerUtbetaling).map((value) => {
                            return { children: t(value), value, required: true }
                        })}
                    />
                </SkjemaElement>

                {ytelser?.includes(InntektEllerUtbetaling.arbeidsavklaringspenger) && (
                    <SkjemaElement>
                        <RHFSpoersmaalRadio
                            name={`inntektViaYtelserFraNAV.aktivitetsplan.svar`}
                            legend={t('inntektenDin.inntektViaYtelserFraNAV.aktivitetsplan.svar')}
                        />
                    </SkjemaElement>
                )}
            </SkjemaGruppe>
        </>
    )
}

export default InntektViaYtelserFraNAV
