import { Box, Heading, List, ReadMore, VStack } from '@navikt/ds-react'
import { differenceInYears } from 'date-fns'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { RHFInput, RHFInputArea, RHFNumberInput } from '~components/felles/rhf/RHFInput'
import { RHFSpoersmaalRadio } from '~components/felles/rhf/RHFRadio'
import { RHFSelect } from '~components/felles/rhf/RHFSelect'
import { useBrukerContext } from '~context/bruker/BrukerContext'
import { IBruker } from '~context/bruker/bruker'
import Bredde from '~typer/bredde'
import { GrunnTilPaavirkelseAvInntekt, IInntekt } from '~typer/inntekt'
import { IValg } from '~typer/Spoersmaal'

export const ForventetInntektTilNesteAar = () => {
    const { t } = useTranslation()

    const { state: bruker } = useBrukerContext()

    const { watch } = useFormContext<IInntekt>()

    const forventetInntektTilNesteAar = watch('forventetInntektTilNesteAar')

    const grunnTilPaaVirkelseAvInntektOptions = Object.values(GrunnTilPaavirkelseAvInntekt).map((value) => {
        return { label: t(value), value }
    })

    // Inntekts felter for Avtalefestet alderspensjon skal kun vises hvis bruker fyller 62 neste år eller er eldre enn 62
    const skalViseAfpFelter = (bruker: IBruker): boolean => {
        if (!!bruker.foedselsdato) {
            const nesteAar = new Date().setFullYear(new Date().getFullYear() + 1)
            const alderNesteAar = differenceInYears(nesteAar, bruker.foedselsdato)

            const alder = differenceInYears(new Date(), bruker.foedselsdato)
            if (alder > 62) {
                return true
            } else if (alderNesteAar === 62) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    return (
        <Box padding="6" background="surface-action-subtle" borderColor="border-action" borderWidth="0 0 0 4">
            <VStack gap="4">
                <Heading size="small">{t('inntektenDin.forventetInntektTilNesteAar.tittel')}</Heading>

                <List>
                    <List.Item>{t('inntektenDin.forventetInntektTilNesteAar.innhold.li1')}</List.Item>
                    <List.Item>{t('inntektenDin.forventetInntektTilNesteAar.innhold.li2')}</List.Item>
                    <List.Item>{t('inntektenDin.forventetInntektTilNesteAar.innhold.li3')}</List.Item>
                </List>

                <VStack gap="2">
                    <RHFNumberInput
                        name={'forventetInntektTilNesteAar.arbeidsinntekt'}
                        label={t('inntektenDin.forventetInntektTilNesteAar.arbeidsinntekt')}
                        htmlSize={Bredde.M}
                    />
                    <ReadMore
                        header={t('inntektenDin.forventetInntektTilNesteAar.arbeidsinntekterDuSkalFylleUt.tittel')}
                    >
                        {t('inntektenDin.forventetInntektTilNesteAar.arbeidsinntekterDuSkalFylleUt.innhold')}
                    </ReadMore>
                </VStack>

                <VStack gap="2">
                    <RHFNumberInput
                        name={'forventetInntektTilNesteAar.naeringsinntekt.inntekt'}
                        label={t('inntektenDin.forventetInntektTilNesteAar.naeringsinntekt.inntekt')}
                        htmlSize={Bredde.M}
                    />
                    <ReadMore
                        header={t('inntektenDin.forventetInntektTilNesteAar.naeringsinntekterDuSkalFylleUt.tittel')}
                    >
                        {t('inntektenDin.forventetInntektTilNesteAar.naeringsinntekterDuSkalFylleUt.innhold')}
                    </ReadMore>
                </VStack>
                {!!forventetInntektTilNesteAar?.naeringsinntekt?.inntekt &&
                    forventetInntektTilNesteAar?.naeringsinntekt?.inntekt !== '0' && (
                        <>
                            <RHFSpoersmaalRadio
                                name={'forventetInntektTilNesteAar.naeringsinntekt.erNaeringsinntektOpptjentJevnt.valg'}
                                legend={t(
                                    'inntektenDin.forventetInntektTilNesteAar.naeringsinntekt.erNaeringsinntektOpptjentJevnt.valg'
                                )}
                            />
                            {forventetInntektTilNesteAar?.naeringsinntekt?.erNaeringsinntektOpptjentJevnt?.valg ===
                                IValg.NEI && (
                                <RHFInputArea
                                    name={
                                        'forventetInntektTilNesteAar.naeringsinntekt.erNaeringsinntektOpptjentJevnt.beskrivelse'
                                    }
                                    label={t(
                                        'inntektenDin.forventetInntektTilNesteAar.naeringsinntekt.erNaeringsinntektOpptjentJevnt.beksrivelse'
                                    )}
                                    description={
                                        'inntektenDin.forventetInntektTilNesteAar.naeringsinntekt.erNaeringsinntektOpptjentJevnt.beksrivelse.beskrivelse'
                                    }
                                />
                            )}
                        </>
                    )}

                {skalViseAfpFelter(bruker) && (
                    <VStack gap="2">
                        <RHFNumberInput
                            name={'forventetInntektTilNesteAar.afpInntekt.inntekt'}
                            label={t('inntektenDin.forventetInntektTilNesteAar.afpInntekt.inntekt')}
                            htmlSize={Bredde.M}
                        />
                        {!!forventetInntektTilNesteAar?.afpInntekt?.inntekt &&
                            forventetInntektTilNesteAar?.afpInntekt?.inntekt !== '0' && (
                                <RHFInput
                                    name={'forventetInntektTilNesteAar.afpInntekt.tjenesteordning'}
                                    label={t('inntektenDin.forventetInntektTilNesteAar.afpInntekt.tjenesteordning')}
                                    description={t(
                                        'inntektenDin.forventetInntektTilNesteAar.afpInntekt.tjenesteordning.beskrivelse'
                                    )}
                                    htmlSize={Bredde.M}
                                />
                            )}
                    </VStack>
                )}

                <VStack gap="2">
                    <RHFNumberInput
                        name={'forventetInntektTilNesteAar.inntektFraUtland'}
                        label={t('inntektenDin.forventetInntektTilNesteAar.inntektFraUtland')}
                        description={t('inntektenDin.forventetInntektTilNesteAar.inntektFraUtland.beskrivelse')}
                        htmlSize={Bredde.M}
                    />
                    <ReadMore
                        header={t('inntektenDin.forventetInntektTilNesteAar.inntekterFraUtlandDuSkalFylleUt.tittel')}
                    >
                        {t('inntektenDin.forventetInntektTilNesteAar.inntekterFraUtlandDuSkalFylleUt.innhold')}
                    </ReadMore>
                </VStack>

                <RHFSpoersmaalRadio
                    name={'forventetInntektTilNesteAar.andreInntekter.valg'}
                    legend={t('inntektenDin.forventetInntektTilNesteAar.andreInntekter.valg')}
                />
                {forventetInntektTilNesteAar?.andreInntekter?.valg === IValg.JA && (
                    <>
                        <RHFNumberInput
                            name={'forventetInntektTilNesteAar.andreInntekter.inntekt'}
                            label={'inntektenDin.forventetInntektTilNesteAar.andreInntekter.inntekt'}
                            htmlSize={Bredde.M}
                        />
                        <RHFInputArea
                            name={'forventetInntektTilNesteAar.andreInntekter.beskrivelse'}
                            label={t('inntektenDin.forventetInntektTilNesteAar.andreInntekter.beskrivelse')}
                        />
                    </>
                )}

                <RHFSpoersmaalRadio
                    name={'forventetInntektTilNesteAar.noeSomKanPaavirkeInntekten.valg'}
                    legend={t('inntektenDin.forventetInntektTilNesteAar.noeSomKanPaavirkeInntekten.valg')}
                />
                {forventetInntektTilNesteAar?.noeSomKanPaavirkeInntekten?.valg === IValg.JA && (
                    <VStack gap="2">
                        <RHFSelect
                            name={'forventetInntektTilNesteAar.noeSomKanPaavirkeInntekten.grunnTilPaavirkelseAvInntekt'}
                            label={
                                'inntektenDin.forventetInntektTilNesteAar.noeSomKanPaavirkeInntekten.grunnTilPaavirkelseAvInntekt'
                            }
                            selectOptions={[{ label: t('felles.velg'), value: '' }].concat(
                                grunnTilPaaVirkelseAvInntektOptions
                            )}
                        />
                        {forventetInntektTilNesteAar.noeSomKanPaavirkeInntekten.grunnTilPaavirkelseAvInntekt ===
                            GrunnTilPaavirkelseAvInntekt.annenGrunn && (
                            <RHFInput
                                name={'forventetInntektTilNesteAar.noeSomKanPaavirkeInntekten.beskrivelse'}
                                label={t(
                                    'inntektenDin.forventetInntektTilNesteAar.noeSomKanPaavirkeInntekten.beskrivelse'
                                )}
                                htmlSize={Bredde.M}
                            />
                        )}
                    </VStack>
                )}
            </VStack>
        </Box>
    )
}
