import { Box, Heading, List, ReadMore, VStack } from '@navikt/ds-react'
import { differenceInYears } from 'date-fns'
import { useFormContext } from 'react-hook-form'
import { RHFInput, RHFInputArea, RHFNumberInput } from '~components/felles/rhf/RHFInput'
import { RHFSpoersmaalRadio } from '~components/felles/rhf/RHFRadio'
import { useBrukerContext } from '~context/bruker/BrukerContext'
import { IBruker } from '~context/bruker/bruker'
import { IValg } from '~typer/Spoersmaal'
import Bredde from '~typer/bredde'
import { IInntekt } from '~typer/inntekt'

export const ForventetInntektIAar = () => {
    const { state: bruker } = useBrukerContext()

    const { watch } = useFormContext<IInntekt>()

    const forventetInntektIAar = watch('forventetInntektIAar')

    // Inntekts felter for Avtalefestet alderspensjon skal kun vises hvis bruker fyller 62 i år eller er eldre enn 62 år
    const skalViseAfpFelter = (bruker: IBruker): Boolean => {
        if (!!bruker.foedselsdato) {
            const alder = differenceInYears(new Date(), bruker.foedselsdato)
            return alder >= 62
        } else {
            return false
        }
    }

    return (
        <Box padding="6" background="surface-action-subtle" borderColor="border-action" borderWidth="0 0 0 4">
            <VStack gap="4">
                <Heading size="small">Forventet årsinntekt i år</Heading>

                <List>
                    <List.Item>Du skal fylle inn det du forventer å tjene i år.</List.Item>
                    <List.Item>Fra januar til og med desember.</List.Item>
                    <List.Item>Inntekten skal være brutto inntekt, altså inntekt før skatt.</List.Item>
                </List>

                <VStack gap="2">
                    <RHFNumberInput
                        name={'forventetInntektIAar.arbeidsinntekt'}
                        label={'Arbeidsinntekt og andre utbetalinger'}
                        htmlSize={Bredde.M}
                    />
                    <ReadMore header={'Arbeidsinntekt og andre utbetalinger du skal melde inn'}>sdg</ReadMore>
                </VStack>

                <VStack gap="2">
                    <RHFNumberInput
                        name={'forventetInntektIAar.naeringsinntekt.inntekt'}
                        label={'Næringsinntekt'}
                        htmlSize={Bredde.M}
                    />
                    <ReadMore header={'Næringsinntekter du skal fylle inn'}>sg</ReadMore>
                </VStack>
                {!!forventetInntektIAar?.naeringsinntekt?.inntekt &&
                    forventetInntektIAar?.naeringsinntekt?.inntekt !== '0' && (
                        <>
                            <RHFSpoersmaalRadio
                                name={'forventetInntektIAar.naeringsinntekt.erNaeringsinntektOpptjentJevnt'}
                                legend={'Er næringsinntekten opptjent jevnt i løpet av året? '}
                            />
                            {forventetInntektIAar?.naeringsinntekt?.erNaeringsinntektOpptjentJevnt === IValg.NEI && (
                                <RHFInputArea
                                    name={'forventetInntektIAar.naeringsinntekt.beskrivelse'}
                                    label={'Skriv kort om hvordan inntekten varierer gjennom året'}
                                    description={'For eksempel når på året det er lav og høy inntekt'}
                                />
                            )}
                        </>
                    )}

                {skalViseAfpFelter(bruker) && (
                    <VStack gap="2">
                        <RHFNumberInput
                            name={'forventetInntektIAar.afpInntekt.inntekt'}
                            label={'AFP offentlig eller privat'}
                            htmlSize={Bredde.M}
                        />
                        {!!forventetInntektIAar?.afpInntekt?.inntekt &&
                            forventetInntektIAar?.afpInntekt?.inntekt !== '0' && (
                                <RHFInput
                                    name={'forventetInntektIAar.afpInntekt.tjenesteordning'}
                                    label={'Hvilken tjenesteordning får du AFP fra?'}
                                    description={'For eksempel KLP, SPK'}
                                    htmlSize={Bredde.M}
                                />
                            )}
                    </VStack>
                )}

                <VStack gap="2">
                    <RHFNumberInput
                        name={'forventetInntektIAar.inntektFraUtland'}
                        label={'Alle inntekter fra utland'}
                        description={'Inntektene skal oppgis i norske kroner'}
                        htmlSize={Bredde.M}
                    />
                    <ReadMore header={'Alle inntekter fra utland'}>adsasd</ReadMore>
                </VStack>

                <RHFSpoersmaalRadio
                    name={'forventetInntektIAar.andreInntekter.harAndreInntekter'}
                    legend={'Hadde du andre inntekter?'}
                />
                {forventetInntektIAar?.andreInntekter?.harAndreInntekter === IValg.JA && (
                    <>
                        <RHFNumberInput
                            name={'forventetInntektIAar.andreInntekter.inntekt'}
                            label={'Andre inntekter'}
                            htmlSize={Bredde.M}
                        />
                        <RHFInputArea
                            name={'forventetInntektIAar.andreInntekter.beskrivelse'}
                            label={'Hva slags inntekt var det?'}
                        />
                    </>
                )}
            </VStack>
        </Box>
    )
}
