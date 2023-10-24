import { useTranslation } from 'react-i18next'
import React from 'react'
import { Heading } from '@navikt/ds-react'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { IInntekt, InntektEllerUtbetaling } from '../../../../typer/inntekt'
import { RHFCheckboksGruppe } from '../../../felles/rhf/RHFCheckboksPanelGruppe'
import { RHFValutaInput } from '../../../felles/rhf/RHFInput'
import { useFormContext } from 'react-hook-form'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import EndringInntekt from './EndringInntekt'
import Bredde from '../../../../typer/bredde'

const AnnenInntekt = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<IInntekt>()

    const inntektEllerUtbetaling = watch('annenInntekt.inntektEllerUtbetaling')

    return (
        <>
            <SkjemaGruppe>
                <SkjemaElement>
                    <Heading size={'medium'}>{t('inntektenDin.annenInntekt.tittel')}</Heading>
                </SkjemaElement>

                <SkjemaElement>
                    <RHFCheckboksGruppe
                        name={'annenInntekt.inntektEllerUtbetaling'}
                        legend={t('inntektenDin.annenInntekt.inntektEllerUtbetaling')}
                        checkboxes={Object.values(InntektEllerUtbetaling).map((value) => {
                            return { children: t(value), value, required: true }
                        })}
                    />
                </SkjemaElement>
                {inntektEllerUtbetaling?.includes(InntektEllerUtbetaling.annen) && (
                    <RHFValutaInput
                        name={'annenInntekt.beloep'}
                        label={t('inntektenDin.annenInntekt.beloep')}
                        htmlSize={Bredde.S}
                    />
                )}
            </SkjemaGruppe>
            <EndringInntekt type={'annenInntekt'} />
        </>
    )
}

export default AnnenInntekt
