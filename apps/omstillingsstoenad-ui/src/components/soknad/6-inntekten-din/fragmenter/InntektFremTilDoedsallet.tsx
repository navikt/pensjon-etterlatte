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

export const InntektFremTilDoedsallet = () => {
    const { state: bruker } = useBrukerContext()

    const { watch } = useFormContext<IInntekt>()

    const inntektFremTilDoedsfallet = watch('inntektFremTilDoedsfallet')

    // Inntekts felter for Avtalefestet alderspensjon skal kun vises hvis bruker er eldre enn 62 år
    const skalViseAfpFelter = (bruker: IBruker): Boolean => {
        if (!!bruker.foedselsdato) {
            const alder = differenceInYears(new Date().getFullYear(), bruker.foedselsdato)
            return alder > 62
        } else {
            return false
        }
    }

    return (
        <Box padding="6" background="surface-action-subtle" borderColor="border-action" borderWidth="0 0 0 4">
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
                        htmlSize={Bredde.M}
                    />
                    <ReadMore header={'Arbeidsinntekt og andre utbetalinger du skal melde inn'}>sdg</ReadMore>
                </VStack>

                <VStack gap="2">
                    <RHFNumberInput
                        name={'inntektFremTilDoedsfallet.naeringsinntekt.inntekt'}
                        label={'Næringsinntekt'}
                        htmlSize={Bredde.M}
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

                {skalViseAfpFelter(bruker) && (
                    <VStack gap="2">
                        <RHFNumberInput
                            name={'inntektFremTilDoedsfallet.afpInntekt.inntekt'}
                            label={'AFP offentlig eller privat'}
                        />
                        {inntektFremTilDoedsfallet?.afpInntekt?.inntekt !== '0' && (
                            <RHFInput
                                name={'inntektFremTilDoedsfallet.afpInntekt.tjenesteordning'}
                                label={'Hvilken tjenesteordning får du AFP fra?'}
                                description={'For eksempel KLP, SPK'}
                            />
                        )}
                    </VStack>
                )}

                <VStack gap="2">
                    <RHFNumberInput
                        name={'inntektFremTilDoedsfallet.inntektFraUtland'}
                        label={'Alle inntekter fra utland'}
                        description={'Inntektene skal oppgis i norske kroner'}
                        htmlSize={Bredde.M}
                    />
                    <ReadMore header={'Alle inntekter fra utland'}>adsasd</ReadMore>
                </VStack>

                <RHFSpoersmaalRadio
                    name={'inntektFremTilDoedsfallet.andreInntekter.harAndreInntekter'}
                    legend={'Hadde du andre inntekter?'}
                />
                {inntektFremTilDoedsfallet?.andreInntekter?.harAndreInntekter === IValg.JA && (
                    <>
                        <RHFNumberInput
                            name={'inntektFremTilDoedsfallet.andreInntekter.inntekt'}
                            label={'Andre inntekter'}
                            htmlSize={Bredde.M}
                        />
                        <RHFInputArea
                            name={'inntektFremTilDoedsfallet.andreInntekter.beskrivelse'}
                            label={'Hva slags inntekt var det?'}
                        />
                    </>
                )}
            </VStack>
        </Box>
    )
}
