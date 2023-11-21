import { useTranslation } from 'react-i18next'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { Heading } from '@navikt/ds-react'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { RHFCheckboksGruppe } from '../../../felles/rhf/RHFCheckboksPanelGruppe'
import { IInntekt, InntektsTyper } from '../../../../typer/inntekt'
import Loennsinntekt from './Loennsinntekt'
import Naeringsinntekt from './Naeringsinntekt'
import PensjonEllerUfoere from './PensjonEllerUfoere'
import AnnenInntekt from './AnnenInntekt'
import styled from 'styled-components'

const MarginBottom = styled.div<{ $margin: boolean }>`
    margin-bottom: ${(props) => (!props.$margin ? '3rem' : '')};
`

const Inntekt = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<IInntekt>()

    const inntektstype = watch('inntektstyper')

    return (
        <MarginBottom $margin={!!inntektstype?.length}>
            <SkjemaElement>
                <Heading size={'medium'}>{t('inntektenDin.undertittel')}</Heading>
            </SkjemaElement>
            <RHFCheckboksGruppe
                name={'inntektstyper'}
                legend={t('inntektenDin.inntektstyper')}
                checkboxes={Object.values(InntektsTyper).map((value) => {
                    return { children: t(value), value, required: true }
                })}
            />

            {inntektstype?.includes(InntektsTyper.loenn) && <Loennsinntekt />}
            {inntektstype?.includes(InntektsTyper.naering) && <Naeringsinntekt />}
            {inntektstype?.includes(InntektsTyper.pensjonEllerUfoere) && <PensjonEllerUfoere />}
            {inntektstype?.includes(InntektsTyper.annen) && <AnnenInntekt />}
        </MarginBottom>
    )
}

export default Inntekt
