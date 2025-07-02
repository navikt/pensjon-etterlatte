import { Box, Heading, List, ReadMore, VStack } from '@navikt/ds-react'
import { differenceInYears } from 'date-fns'
import { useFormContext } from 'react-hook-form'
import { RHFInput, RHFInputArea, RHFNumberInput } from '~components/felles/rhf/RHFInput'
import { RHFSpoersmaalRadio } from '~components/felles/rhf/RHFRadio'
import { RHFSelect } from '~components/felles/rhf/RHFSelect'
import { useBrukerContext } from '~context/bruker/BrukerContext'
import { IBruker } from '~context/bruker/bruker'
import Bredde from '~typer/bredde'
import { GrunnTilPaavirkelseAvInntekt, IInntekt } from '~typer/inntekt'
import { IValg } from '~typer/Spoersmaal'

export const ForventetInntektTilNesteAar = () => {
    const { state: bruker } = useBrukerContext()

    const { watch } = useFormContext<IInntekt>()

    const forventetInntektTilNesteAar = watch('forventetInntektTilNesteAar')

    // Inntekts felter for Avtalefestet alderspensjon skal kun vises hvis bruker fyller 62 neste år eller er eldre enn 62
    const skalViseAfpFelter = (_bruker: IBruker): Boolean => {
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
                            {forventetInntektTilNesteAar?.naeringsinntekt?.erNaeringsinntektOpptjentJevnt ===
                                IValg.NEI && (
                                <RHFInputArea
                                    name={'forventetInntektTilNesteAar.naeringsinntekt.beskrivelse'}
                                    label={'Skriv kort om hvordan inntekten varierer gjennom året'}
                                    description={'For eksempel når på året det er lav og høy inntekt'}
                                />
                            )}
                        </>
                    )}

                {skalViseAfpFelter(bruker) && (
                    <VStack gap="2">
                        <RHFNumberInput
                            name={'forventetInntektTilNesteAar.afpInntekt.inntekt'}
                            label={'AFP offentlig eller privat'}
                            htmlSize={Bredde.M}
                        />
                        {!!forventetInntektTilNesteAar?.afpInntekt?.inntekt &&
                            forventetInntektTilNesteAar?.afpInntekt?.inntekt !== '0' && (
                                <RHFInput
                                    name={'forventetInntektTilNesteAar.afpInntekt.tjenesteordning'}
                                    label={'Hvilken tjenesteordning får du AFP fra?'}
                                    description={'For eksempel KLP, SPK'}
                                    htmlSize={Bredde.M}
                                />
                            )}
                    </VStack>
                )}

                <VStack gap="2">
                    <RHFNumberInput
                        name={'forventetInntektTilNesteAar.inntektFraUtland'}
                        label={'Alle inntekter fra utland'}
                        description={'Inntektene skal oppgis i norske kroner'}
                        htmlSize={Bredde.M}
                    />
                    <ReadMore header={'Alle inntekter fra utland'}>adsasd</ReadMore>
                </VStack>

                <RHFSpoersmaalRadio
                    name={'forventetInntektTilNesteAar.andreInntekter.harAndreInntekter'}
                    legend={'Kommer du til å ha andre inntekter?'}
                />
                {forventetInntektTilNesteAar?.andreInntekter?.harAndreInntekter === IValg.JA && (
                    <>
                        <RHFNumberInput
                            name={'forventetInntektTilNesteAar.andreInntekter.inntekt'}
                            label={'Andre inntekter'}
                            htmlSize={Bredde.M}
                        />
                        <RHFInputArea
                            name={'forventetInntektTilNesteAar.andreInntekter.beskrivelse'}
                            label={'Hva slags inntekt er det?'}
                        />
                    </>
                )}

                <RHFSpoersmaalRadio
                    name={'forventetInntektTilNesteAar.noeSomKanPaavirkeInntekten.erNoeSomKanPaavirkeInntekten'}
                    legend={'Er det noe du vet om i dag som kan påvirke inntekten din fremover?'}
                />
                {forventetInntektTilNesteAar?.noeSomKanPaavirkeInntekten?.erNoeSomKanPaavirkeInntekten === IValg.JA && (
                    <VStack gap="2">
                        <RHFSelect
                            name={'forventetInntektTilNesteAar.noeSomKanPaavirkeInntekten.grunnTilPaavirkelseAvInntekt'}
                            label={'Hva er grunnen til at inntekten endrer seg?'}
                            selectOptions={Object.values(GrunnTilPaavirkelseAvInntekt).map((value) => {
                                return { label: value, value: value }
                            })}
                        />
                        {forventetInntektTilNesteAar.noeSomKanPaavirkeInntekten.grunnTilPaavirkelseAvInntekt ===
                            GrunnTilPaavirkelseAvInntekt.annenGrunn && (
                            <RHFInput
                                name={'forventetInntektTilNesteAar.noeSomKanPaavirkeInntekten.beskrivelse'}
                                label={'Beskriv endringen'}
                                htmlSize={Bredde.M}
                            />
                        )}
                    </VStack>
                )}
            </VStack>
        </Box>
    )
}
