import { Box, Heading } from '@navikt/ds-react'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { IInntekt, InntektsTyper } from '../../../../typer/inntekt'
import { RHFCheckboksGruppe } from '../../../felles/rhf/RHFCheckboksPanelGruppe'
import IngenInntekt from './IngenInntekt'
import InntektViaYtelserFraNAV from './InntektViaYtelserFraNAV'
import Loennsinntekt from './Loennsinntekt'
import Naeringsinntekt from './Naeringsinntekt'
import PensjonEllerUfoere from './PensjonEllerUfoere'

const MarginBottom = styled.div<{ $margin: boolean }>`
    margin-bottom: ${(props) => (!props.$margin ? '3rem' : '')};
`

const Inntekt = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<IInntekt>()

    const inntektstype = watch('inntektstyper')

    return (
        <MarginBottom $margin={!!inntektstype?.length}>
            <Box marginBlock="4">
                <Heading size={'medium'}>{t('inntektenDin.undertittel')}</Heading>
            </Box>
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
            {inntektstype?.includes(InntektsTyper.ytelser) && <InntektViaYtelserFraNAV />}
            {inntektstype?.includes(InntektsTyper.annen) && <IngenInntekt />}
        </MarginBottom>
    )
}

export default Inntekt
