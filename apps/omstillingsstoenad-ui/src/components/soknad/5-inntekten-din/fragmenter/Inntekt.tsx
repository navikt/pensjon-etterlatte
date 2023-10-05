import { useTranslation } from 'react-i18next'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Heading } from '@navikt/ds-react'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { RHFCheckboksGruppe } from '../../../felles/rhf/RHFCheckboksPanelGruppe'
import { IInntekt, InntektsTyper } from '../../../../typer/inntekt'

const Inntekt = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<IInntekt>()

    const inntektstype = watch('inntektstyper')

    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <Heading size={'small'}>{t('inntektenDin.undertittel')}</Heading>
            </SkjemaElement>
            <RHFCheckboksGruppe
                name={'inntektstyper'}
                legend={t('inntektenDin.inntektstyper')}
                checkboxes={Object.values(InntektsTyper).map((value) => {
                    return { children: t(value), value, required: true }
                })}
            />

            {inntektstype?.includes(InntektsTyper.loenn) && <p>LØNN KOMMER HER</p>}
            {inntektstype?.includes(InntektsTyper.naering) && <p>NÆRING KOMMER HER</p>}
            {inntektstype?.includes(InntektsTyper.pensjonEllerUfoere) && <p>PENSJON KOMMER HER</p>}
            {inntektstype?.includes(InntektsTyper.annen) && <p>ANNEN KOMMER HER</p>}
        </SkjemaGruppe>
    )
}

export default Inntekt
