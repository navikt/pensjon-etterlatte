import { Box, Heading, List, ReadMore, VStack } from '@navikt/ds-react'
import { useBrukerContext } from '~context/bruker/BrukerContext'
import { useFormContext } from 'react-hook-form'
import { IInntekt } from '~typer/inntekt'
import { differenceInYears } from 'date-fns'
import { IBruker } from '~context/bruker/bruker'
import { RHFInputArea, RHFNumberInput } from '~components/felles/rhf/RHFInput'
import Bredde from '~typer/bredde'
import { RHFSpoersmaalRadio } from '~components/felles/rhf/RHFRadio'
import { IValg } from '~typer/Spoersmaal'

export const ForventetInntektTilNesteAar = () => {
    const { state: bruker } = useBrukerContext()

    const { watch } = useFormContext<IInntekt>()

    const forventetInntektTilNesteAar = watch('forventetInntektTilNesteAar')

    // Inntekts felter for Avtalefestet alderspensjon skal kun vises hvis bruker fyller 62 neste år eller er eldre enn 62
    const skalViseAfpFelter = (bruker: IBruker): Boolean => {
        return false
        // if (!!bruker.foedselsdato) {
        //     const alder = differenceInYears(new Date(), bruker.foedselsdato)
        //     return alder >= 62
        // } else {
        //     return false
        // }
    }

    return (
            <Box padding="6" background="surface-action-subtle" borderColor="border-action" borderWidth="0 0 0 4">
                <VStack gap="4">
                    <Heading size="small">Forventet inntekt til neste år</Heading>

                    <List>
                        <List.Item>Du skal fylle inn det du forventer å tjene til neste år.</List.Item>
                        <List.Item>Fra januar til og med desember</List.Item>
                        <List.Item>Inntekten skal være brutto inntekt, altså inntekt før skatt.</List.Item>
                    </List>

                    <VStack gap="2">
                        <RHFNumberInput
                                name={'forventetInntektTilNesteAar.arbeidsinntekt'}
                                label={'Arbeidsinntekt og andre utbetalinger'}
                                htmlSize={Bredde.M}
                        />
                        <ReadMore header={'Arbeidsinntekt og andre utbetalinger du skal melde inn'}>sdg</ReadMore>
                    </VStack>

                    <VStack gap="2">
                        <RHFNumberInput
                                name={'forventetInntektTilNesteAar.naeringsinntekt.inntekt'}
                                label={'Næringsinntekt'}
                                htmlSize={Bredde.M}
                        />
                        <ReadMore header={'Næringsinntekter du skal fylle inn'}>sg</ReadMore>
                    </VStack>
                    {!!forventetInntektTilNesteAar?.naeringsinntekt?.inntekt &&
                            forventetInntektTilNesteAar?.naeringsinntekt?.inntekt !== '0' && (
                                    <>
                                        <RHFSpoersmaalRadio
                                                name={'forventetInntektTilNesteAar.naeringsinntekt.erNaeringsinntektOpptjentJevnt'}
                                                legend={'Er næringsinntekten opptjent jevnt i løpet av året? '}
                                        />
                                        {forventetInntektTilNesteAar?.naeringsinntekt?.erNaeringsinntektOpptjentJevnt === IValg.NEI && (
                                                <RHFInputArea
                                                        name={'forventetInntektTilNesteAar.naeringsinntekt.beskrivelse'}
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