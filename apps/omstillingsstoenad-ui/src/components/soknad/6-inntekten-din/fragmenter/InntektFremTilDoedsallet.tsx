import { Box, Heading, List, ReadMore, VStack } from '@navikt/ds-react'
import { useFormContext } from 'react-hook-form'
import { RHFInputArea, RHFNumberInput } from '~components/felles/rhf/RHFInput'
import { RHFSpoersmaalRadio } from '~components/felles/rhf/RHFRadio'
import { IValg } from '~typer/Spoersmaal'
import { IInntekt } from '~typer/inntekt'

export const InntektFremTilDoedsallet = () => {
    const { watch } = useFormContext<IInntekt>()

    const inntektFremTilDoedsfallet = watch('inntektFremTilDoedsfallet')

    return (
        <Box
            paddingInline="6"
            paddingBlock="4"
            background="surface-action-subtle"
            borderColor="border-action"
            borderWidth="0 0 0 4"
        >
            <VStack gap="4">
                <Heading size="small">Inntekt frem til dødsfallet</Heading>

                <List>
                    <List.Item>
                        Du skal fylle inn det du tjente fra januar og til og med måneden da dødsfallet skjedde.
                    </List.Item>
                    <List.Item>
                        Hvis dødsfallet skjedde i januar, oppgir du inntekten for januar. Hvis dødsfallet skjedde i
                        desember, oppgir du hele årsinntekten.
                    </List.Item>
                    <List.Item>Inntekten skal være brutto inntekt, altså inntekt før skatt.</List.Item>
                </List>

                <VStack gap="2">
                    <RHFNumberInput
                        name={'inntektFremTilDoedsfallet.arbeidsinntekt'}
                        label={'Arbeidsinntekt og andre utbetalinger'}
                    />
                    <ReadMore header={'Arbeidsinntekt og andre utbetalinger du skal melde inn'}>sdg</ReadMore>
                </VStack>

                <VStack gap="2">
                    <RHFNumberInput
                        name={'inntektFremTilDoedsfallet.naeringsinntekt.inntekt'}
                        label={'Næringsinntekt'}
                    />
                    <ReadMore header={'Næringsinntekter du skal fylle inn'}>sg</ReadMore>
                </VStack>
                {!!inntektFremTilDoedsfallet?.naeringsinntekt?.inntekt && (
                    <>
                        <RHFSpoersmaalRadio
                            name={'inntektFremTilDoedsfallet.naeringsinntekt.erNaeringsinntektOpptjentJevnt'}
                            legend={'Er næringsinntekten opptjent jevnt i løpet av året? '}
                        />
                        {inntektFremTilDoedsfallet?.naeringsinntekt?.erNaeringsinntektOpptjentJevnt === IValg.NEI && (
                            <RHFInputArea
                                name={'inntektFremTilDoedsfallet.naeringsinntekt.beskrivelse'}
                                label={'Skriv kort om hvordan inntekten varierer gjennom året'}
                                description={'For eksempel når på året det er lav og høy inntekt'}
                            />
                        )}
                    </>
                )}
            </VStack>
        </Box>
    )
}
