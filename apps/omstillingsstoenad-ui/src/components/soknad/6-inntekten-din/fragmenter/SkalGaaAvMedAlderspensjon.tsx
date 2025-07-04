import { ReadMore, VStack } from '@navikt/ds-react'
import { useFormContext } from 'react-hook-form'
import { Maanedvelger } from '~components/felles/Maanedvelger'
import { RHFSpoersmaalRadio } from '~components/felles/rhf/RHFRadio'
import { IInntekt } from '~typer/inntekt'

export const SkalGaaAvMedAlderspensjon = () => {
    const { watch } = useFormContext<IInntekt>()

    const _skalGaAavMedAlderspensjon = watch('skalGaaAvMedAlderspensjon')

    return (
        <VStack gap="4">
            <VStack gap="2">
                <RHFSpoersmaalRadio
                    name={'skalGaaAvMedAlderspensjon.valg'}
                    legend={'Skal du gå av med alderspensjon å år?'}
                    vetIkke
                />
                <ReadMore header={'Når kan jeg ta ut alderspensjon?'}>asdasd</ReadMore>
            </VStack>

            <Maanedvelger
                name={'skalGaaAvMedAlderspensjon.datoForAaGaaAvMedAlderspensjon'}
                label={'Når planlegger du å gå av med alderspensjon'}
            />
        </VStack>
    )
}
