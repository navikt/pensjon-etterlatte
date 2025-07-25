import { Box, Heading, List, ReadMore, VStack } from '@navikt/ds-react'
import { differenceInYears } from 'date-fns'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { RHFInput, RHFInputArea, RHFNumberInput } from '~components/felles/rhf/RHFInput'
import { RHFSpoersmaalRadio } from '~components/felles/rhf/RHFRadio'
import { RHFSelect } from '~components/felles/rhf/RHFSelect'
import { ArbeidsinntekterDuSkalFylleUtReadMore } from '~components/soknad/6-inntekten-din/fragmenter/felles/ArbeidsinntekterDuSkalFylleUtReadMore'
import { InntekterFraUtlandDuSkalFylleUt } from '~components/soknad/6-inntekten-din/fragmenter/felles/InntekterFraUtlandDuSkalFylleUt'
import { NaeringsinntekterDuSkalFylleUtReadMore } from '~components/soknad/6-inntekten-din/fragmenter/felles/NaeringsinntekterDuSkalFylleUtReadMore'
import { useBrukerContext } from '~context/bruker/BrukerContext'
import { IBruker } from '~context/bruker/bruker'
import Bredde from '~typer/bredde'
import { GrunnTilPaavirkelseAvInntekt, IInntekt } from '~typer/inntekt'
import { IValg } from '~typer/Spoersmaal'

export const ForventetInntektIAar = () => {
    const { t } = useTranslation()

    const { state: bruker } = useBrukerContext()

    const { watch } = useFormContext<IInntekt>()

    const forventetInntektIAar = watch('forventetInntektIAar')

    const grunnTilPaaVirkelseAvInntektOptions = Object.values(GrunnTilPaavirkelseAvInntekt).map((value) => {
        return { label: t(value), value }
    })

    // Inntekts felter for Avtalefestet alderspensjon skal kun vises hvis bruker fyller 62 i år eller er eldre enn 62 år
    const skalViseAfpFelter = (bruker: IBruker): boolean => {
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
                <Heading size="small">{t('inntektenDin.forventetInntektIAar.tittel')}</Heading>

                <List>
                    <List.Item>{t('inntektenDin.forventetInntektIAar.innhold.li1')}</List.Item>
                    <List.Item>{t('inntektenDin.forventetInntektIAar.innhold.li2')}</List.Item>
                    <List.Item>{t('inntektenDin.forventetInntektIAar.innhold.li3')}</List.Item>
                </List>

                <VStack gap="2">
                    <RHFNumberInput
                        name={'forventetInntektIAar.arbeidsinntekt'}
                        label={t('inntektenDin.forventetInntektIAar.arbeidsinntekt')}
                        htmlSize={Bredde.M}
                    />
                    <ArbeidsinntekterDuSkalFylleUtReadMore />
                </VStack>

                <VStack gap="2">
                    <RHFNumberInput
                        name={'forventetInntektIAar.naeringsinntekt.inntekt'}
                        label={t('inntektenDin.forventetInntektIAar.naeringsinntekt.inntekt')}
                        htmlSize={Bredde.M}
                    />
                    <NaeringsinntekterDuSkalFylleUtReadMore />
                </VStack>
                {!!forventetInntektIAar?.naeringsinntekt?.inntekt &&
                    forventetInntektIAar?.naeringsinntekt?.inntekt !== '0' && (
                        <>
                            <RHFSpoersmaalRadio
                                name={'forventetInntektIAar.naeringsinntekt.erNaeringsinntektOpptjentJevnt.valg'}
                                legend={t(
                                    'inntektenDin.forventetInntektIAar.naeringsinntekt.erNaeringsinntektOpptjentJevnt.valg'
                                )}
                            />
                            {forventetInntektIAar?.naeringsinntekt?.erNaeringsinntektOpptjentJevnt?.valg ===
                                IValg.NEI && (
                                <RHFInputArea
                                    name={'forventetInntektIAar.naeringsinntekt.beskrivelse'}
                                    label={t(
                                        'inntektenDin.forventetInntektIAar.naeringsinntekt.erNaeringsinntektOpptjentJevnt.beksrivelse'
                                    )}
                                    description={t(
                                        'inntektenDin.forventetInntektIAar.naeringsinntekt.erNaeringsinntektOpptjentJevnt.beksrivelse.beskrivelse'
                                    )}
                                />
                            )}
                        </>
                    )}

                {skalViseAfpFelter(bruker) && (
                    <VStack gap="2">
                        <RHFNumberInput
                            name={'forventetInntektIAar.afpInntekt.inntekt'}
                            label={t('inntektenDin.forventetInntektIAar.afpInntekt.inntekt')}
                            htmlSize={Bredde.M}
                        />
                        {!!forventetInntektIAar?.afpInntekt?.inntekt &&
                            forventetInntektIAar?.afpInntekt?.inntekt !== '0' && (
                                <RHFInput
                                    name={'forventetInntektIAar.afpInntekt.tjenesteordning'}
                                    label={t('inntektenDin.forventetInntektIAar.afpInntekt.tjenesteordning')}
                                    description={t(
                                        'inntektenDin.forventetInntektIAar.afpInntekt.tjenesteordning.beskrivelse'
                                    )}
                                    htmlSize={Bredde.M}
                                />
                            )}
                    </VStack>
                )}

                <VStack gap="2">
                    <RHFNumberInput
                        name={'forventetInntektIAar.inntektFraUtland'}
                        label={t('inntektenDin.forventetInntektIAar.inntektFraUtland')}
                        description={t('inntektenDin.forventetInntektIAar.inntektFraUtland.beskrivelse')}
                        htmlSize={Bredde.M}
                    />
                    <InntekterFraUtlandDuSkalFylleUt />
                </VStack>

                <RHFSpoersmaalRadio
                    name={'forventetInntektIAar.andreInntekter.valg'}
                    legend={t('inntektenDin.forventetInntektIAar.andreInntekter.valg')}
                />
                {forventetInntektIAar?.andreInntekter?.valg === IValg.JA && (
                    <>
                        <RHFNumberInput
                            name={'forventetInntektIAar.andreInntekter.inntekt'}
                            label={t('inntektenDin.forventetInntektIAar.andreInntekter.inntekt')}
                            htmlSize={Bredde.M}
                        />
                        <RHFInputArea
                            name={'forventetInntektIAar.andreInntekter.beskrivelse'}
                            label={t('inntektenDin.forventetInntektIAar.andreInntekter.beskrivelse')}
                        />
                    </>
                )}

                <RHFSpoersmaalRadio
                    name={'forventetInntektIAar.noeSomKanPaavirkeInntekten.valg'}
                    legend={t('inntektenDin.forventetInntektIAar.noeSomKanPaavirkeInntekten.valg')}
                />
                {forventetInntektIAar?.noeSomKanPaavirkeInntekten?.valg === IValg.JA && (
                    <VStack gap="2">
                        <RHFSelect
                            name={'forventetInntektIAar.noeSomKanPaavirkeInntekten.grunnTilPaavirkelseAvInntekt'}
                            label={t(
                                'inntektenDin.forventetInntektIAar.noeSomKanPaavirkeInntekten.grunnTilPaavirkelseAvInntekt'
                            )}
                            selectOptions={[{ label: t('felles.velg'), value: '' }].concat(
                                grunnTilPaaVirkelseAvInntektOptions
                            )}
                        />
                        {forventetInntektIAar.noeSomKanPaavirkeInntekten.grunnTilPaavirkelseAvInntekt ===
                            GrunnTilPaavirkelseAvInntekt.annenGrunn && (
                            <RHFInput
                                name={'forventetInntektIAar.noeSomKanPaavirkeInntekten.beskrivelse'}
                                label={t('inntektenDin.forventetInntektIAar.noeSomKanPaavirkeInntekten.beskrivelse')}
                                htmlSize={Bredde.M}
                            />
                        )}
                    </VStack>
                )}
            </VStack>
        </Box>
    )
}
