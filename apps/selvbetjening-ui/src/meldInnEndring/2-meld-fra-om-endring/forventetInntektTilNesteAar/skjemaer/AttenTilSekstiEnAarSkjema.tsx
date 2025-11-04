import { ReadMore, VStack } from '@navikt/ds-react'
import { useFormContext } from 'react-hook-form'
import { KomponentLaster } from '../../../../common/KomponentLaster.tsx'
import { SanityRikTekst } from '../../../../common/sanity/SanityRikTekst.tsx'
import { useSanityInnhold } from '../../../../common/sanity/useSanityInnhold.ts'
import { useSpraak } from '../../../../common/spraak/SpraakContext.tsx'
import { ControlledInntektTextField } from '../../../../inntektsjustering/components/controlledInntektTextField/ControlledInntektTextField.tsx'
import { Alder, MeldtInnEndring } from '../../../../types/meldInnEndring.ts'
import { MeldInnEndringMeldFra } from '../../../sanity.types.ts'
import { SumAvOppgittInntekt } from './SumAvOppgittInntekt.tsx'
import { forventetInntektTilNesteAarSkjemaValuesTilValues } from './utils.ts'

export const AttenTilSekstiEnAarSkjema = () => {
    const spraak = useSpraak()

    const { control, watch } = useFormContext<MeldtInnEndring>()

    const { innhold, error, isLoading } = useSanityInnhold<MeldInnEndringMeldFra>('*[_type == "meldInnEndringMeldFra"]')

    if (isLoading) {
        return <KomponentLaster />
    }

    if (error) {
        throw error
    }

    if (!innhold?.forventetInntektTilNesteAarSkjemer?.attenTilSekstiEnAarSkjema) {
        throw new Error('Fant ikke sanity innhold for 18 - 61 år')
    }

    const { arbeidsinntekt, inntektFraUtland, naeringsinntekt, sumAvInntekt } =
        innhold.forventetInntektTilNesteAarSkjemer.attenTilSekstiEnAarSkjema

    return (
        !!innhold && (
            <>
                <VStack gap="2">
                    <ControlledInntektTextField
                        name={'forventetInntektTilNesteAar.arbeidsinntekt'}
                        control={control}
                        label={arbeidsinntekt?.label?.[spraak]}
                        description={arbeidsinntekt?.description?.[spraak]}
                    />
                    {!!arbeidsinntekt?.readMore && (
                        <ReadMore header={arbeidsinntekt?.readMore?.tittel?.[spraak]}>
                            <SanityRikTekst text={arbeidsinntekt?.readMore?.innhold?.[spraak]} />
                        </ReadMore>
                    )}
                </VStack>

                <VStack gap="2">
                    <ControlledInntektTextField
                        name={'forventetInntektTilNesteAar.naeringsinntekt'}
                        control={control}
                        label={naeringsinntekt?.label?.[spraak]}
                        description={naeringsinntekt?.description?.[spraak]}
                    />
                    {!!naeringsinntekt?.readMore && (
                        <ReadMore header={naeringsinntekt?.readMore?.tittel?.[spraak]}>
                            <SanityRikTekst text={naeringsinntekt?.readMore?.innhold?.[spraak]} />
                        </ReadMore>
                    )}
                </VStack>

                <VStack gap="2">
                    <ControlledInntektTextField
                        name={'forventetInntektTilNesteAar.inntektFraUtland'}
                        control={control}
                        label={inntektFraUtland?.label?.[spraak]}
                        description={inntektFraUtland?.description?.[spraak]}
                    />
                    {!!inntektFraUtland?.readMore && (
                        <ReadMore header={inntektFraUtland?.readMore?.tittel?.[spraak]}>
                            <SanityRikTekst text={inntektFraUtland?.readMore?.innhold?.[spraak]} />
                        </ReadMore>
                    )}
                </VStack>

                <SumAvOppgittInntekt
                    forventetInntektTilNesteAar={forventetInntektTilNesteAarSkjemaValuesTilValues(
                        watch('forventetInntektTilNesteAar')!
                    )}
                    alder={Alder.ATTEN_TIL_SEKSTI_EN}
                >
                    <SanityRikTekst text={sumAvInntekt?.[spraak]} />
                </SumAvOppgittInntekt>
            </>
        )
    )
}
