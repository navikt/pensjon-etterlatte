import { ReadMore, VStack } from '@navikt/ds-react'
import { useFormContext } from 'react-hook-form'
import { ControlledInntektTextField } from '../../../../inntektsjustering/components/controlledInntektTextField/ControlledInntektTextField.tsx'
import { Alder, MeldtInnEndring } from '../../../../types/meldInnEndring.ts'
import { SumAvOppgittInntekt } from './SumAvOppgittInntekt.tsx'
import { forventetInntektTilNesteAarSkjemaValuesTilValues } from './utils.ts'

export const AttenTilSekstiEnAarSkjema = () => {
    const { control, watch } = useFormContext<MeldtInnEndring>()

    return (
        <>
            <VStack gap="2">
                <ControlledInntektTextField
                    name={'forventetInntektTilNesteAar.arbeidsinntekt'}
                    control={control}
                    label="Arbeidsinntekt"
                    description="Beskrivelse jauda jauda"
                />
                <ReadMore header={'Arbeidsinntekter'}>Her kommer det masse arbeidsinntekter</ReadMore>
            </VStack>

            <VStack gap="2">
                <ControlledInntektTextField
                    name={'forventetInntektTilNesteAar.naeringsinntekt'}
                    control={control}
                    label="Næringsinntekt"
                    description="Bskrivelse jau"
                />
                <ReadMore header={'Næringsinntekt'}>Her komme det masse næringsinntekter</ReadMore>
            </VStack>

            <ControlledInntektTextField
                name={'forventetInntektTilNesteAar.inntektFraUtland'}
                control={control}
                label="Inntekt fra utland"
                description="Beskrivelse pauda"
            />

            <SumAvOppgittInntekt
                forventetInntektTilNesteAar={forventetInntektTilNesteAarSkjemaValuesTilValues(
                    watch('forventetInntektTilNesteAar')!
                )}
                alder={Alder.ATTEN_TIL_SEKSTI_EN}
            >
                Husker ikke hva som skal her?
            </SumAvOppgittInntekt>
        </>
    )
}
