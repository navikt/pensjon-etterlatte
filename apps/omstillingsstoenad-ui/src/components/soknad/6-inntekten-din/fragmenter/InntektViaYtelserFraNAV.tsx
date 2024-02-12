import { useTranslation } from 'react-i18next'
import React from 'react'
import { Heading } from '@navikt/ds-react'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { InntektEllerUtbetaling } from '../../../../typer/inntekt'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { RHFCheckboksGruppe } from '../../../felles/rhf/RHFCheckboksPanelGruppe'

const InntektViaYtelserFraNAV = () => {
    const { t } = useTranslation()

    return (
        <>
            <SkjemaGruppe>
                <SkjemaElement>
                    <Heading size={'medium'}>{t('inntektenDin.inntektViaYtelserFraNAV.tittel')}</Heading>
                </SkjemaElement>

                <SkjemaElement>
                    <RHFCheckboksGruppe
                        name={'inntektViaYtelserFraNAV.inntektEllerUtbetaling'}
                        legend={t('inntektenDin.inntektViaYtelserFraNAV.inntektEllerUtbetaling')}
                        checkboxes={Object.values(InntektEllerUtbetaling).map((value) => {
                            return { children: t(value), value, required: true }
                        })}
                    />
                </SkjemaElement>
            </SkjemaGruppe>
        </>
    )
}

export default InntektViaYtelserFraNAV
