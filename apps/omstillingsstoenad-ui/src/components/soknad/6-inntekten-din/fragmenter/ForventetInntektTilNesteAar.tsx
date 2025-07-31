import { Box, Heading, List, VStack } from '@navikt/ds-react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { RHFInntektInput, RHFInput, RHFInputArea } from '~components/felles/rhf/RHFInput'
import { RHFSpoersmaalRadio } from '~components/felles/rhf/RHFRadio'
import { RHFSelect } from '~components/felles/rhf/RHFSelect'
import { skalViseAFPFelter } from '~components/soknad/6-inntekten-din/fragmenter/afp'
import { ArbeidsinntekterDuSkalFylleUtReadMore } from '~components/soknad/6-inntekten-din/fragmenter/felles/ArbeidsinntekterDuSkalFylleUtReadMore'
import { InntekterFraUtlandDuSkalFylleUt } from '~components/soknad/6-inntekten-din/fragmenter/felles/InntekterFraUtlandDuSkalFylleUt'
import { NaeringsinntekterDuSkalFylleUtReadMore } from '~components/soknad/6-inntekten-din/fragmenter/felles/NaeringsinntekterDuSkalFylleUtReadMore'
import { useBrukerContext } from '~context/bruker/BrukerContext'
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
                    <RHFInntektInput
                        name={'forventetInntektTilNesteAar.arbeidsinntekt'}
                        label={t('inntektenDin.forventetInntektTilNesteAar.arbeidsinntekt')}
                    />
                    <ArbeidsinntekterDuSkalFylleUtReadMore />
                </VStack>

                <VStack gap="2">
                    <RHFInntektInput
                        name={'forventetInntektTilNesteAar.naeringsinntekt.inntekt'}
                        label={t('inntektenDin.forventetInntektTilNesteAar.naeringsinntekt.inntekt')}
                    />
                    <NaeringsinntekterDuSkalFylleUtReadMore />
                </VStack>
                {!!forventetInntektTilNesteAar?.naeringsinntekt?.inntekt &&
                    forventetInntektTilNesteAar?.naeringsinntekt?.inntekt !== '0' && (
                        <>
                            <RHFSpoersmaalRadio
                                name={'forventetInntektTilNesteAar.naeringsinntekt.erNaeringsinntektOpptjentJevnt.valg'}
                                legend={t(
                                    'inntektenDin.forventetInntektTilNesteAar.naeringsinntekt.erNaeringsinntektOpptjentJevnt.valg'
                                )}
                                vetIkke
                            />
                            {forventetInntektTilNesteAar?.naeringsinntekt?.erNaeringsinntektOpptjentJevnt?.valg ===
                                IValg.NEI && (
                                <RHFInputArea
                                    name={
                                        'forventetInntektTilNesteAar.naeringsinntekt.erNaeringsinntektOpptjentJevnt.beskrivelse'
                                    }
                                    label={t(
                                        'inntektenDin.forventetInntektTilNesteAar.naeringsinntekt.erNaeringsinntektOpptjentJevnt.beskrivelse'
                                    )}
                                    description={t(
                                        'inntektenDin.forventetInntektTilNesteAar.naeringsinntekt.erNaeringsinntektOpptjentJevnt.beskrivelse.beskrivelse'
                                    )}
                                    visPersonopplysningerVarsel={false}
                                    maxLength={1000}
                                />
                            )}
                        </>
                    )}

                {skalViseAFPFelter(bruker) && (
                    <VStack gap="2">
                        <RHFInntektInput
                            name={'forventetInntektTilNesteAar.afpInntekt.inntekt'}
                            label={t('inntektenDin.forventetInntektTilNesteAar.afpInntekt.inntekt')}
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
                    <RHFInntektInput
                        name={'forventetInntektTilNesteAar.inntektFraUtland'}
                        label={t('inntektenDin.forventetInntektTilNesteAar.inntektFraUtland')}
                        description={t('inntektenDin.forventetInntektTilNesteAar.inntektFraUtland.beskrivelse')}
                    />
                    <InntekterFraUtlandDuSkalFylleUt />
                </VStack>

                <RHFSpoersmaalRadio
                    name={'forventetInntektTilNesteAar.andreInntekter.valg'}
                    legend={t('inntektenDin.forventetInntektTilNesteAar.andreInntekter.valg')}
                    vetIkke
                />
                {forventetInntektTilNesteAar?.andreInntekter?.valg === IValg.JA && (
                    <>
                        <RHFInntektInput
                            name={'forventetInntektTilNesteAar.andreInntekter.inntekt'}
                            label={t('inntektenDin.forventetInntektTilNesteAar.andreInntekter.inntekt')}
                        />
                        <RHFInputArea
                            name={'forventetInntektTilNesteAar.andreInntekter.beskrivelse'}
                            label={t('inntektenDin.forventetInntektTilNesteAar.andreInntekter.beskrivelse')}
                            visPersonopplysningerVarsel={false}
                            maxLength={1000}
                        />
                    </>
                )}

                <RHFSpoersmaalRadio
                    name={'forventetInntektTilNesteAar.noeSomKanPaavirkeInntekten.valg'}
                    legend={t('inntektenDin.forventetInntektTilNesteAar.noeSomKanPaavirkeInntekten.valg')}
                    vetIkke
                />
                {forventetInntektTilNesteAar?.noeSomKanPaavirkeInntekten?.valg === IValg.JA && (
                    <VStack gap="2">
                        <RHFSelect
                            name={'forventetInntektTilNesteAar.noeSomKanPaavirkeInntekten.grunnTilPaavirkelseAvInntekt'}
                            label={t(
                                'inntektenDin.forventetInntektTilNesteAar.noeSomKanPaavirkeInntekten.grunnTilPaavirkelseAvInntekt'
                            )}
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
