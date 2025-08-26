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
import { fyllerSekstiSyvIAar } from '~utils/alder'

export const ForventetInntektIAar = () => {
    const { t } = useTranslation()

    const { state: bruker } = useBrukerContext()

    const { watch } = useFormContext<IInntekt>()

    const forventetInntektIAar = watch('forventetInntektIAar')

    const grunnTilPaaVirkelseAvInntektOptions = Object.values(GrunnTilPaavirkelseAvInntekt).map((value) => {
        return { label: t(value), value }
    })

    return (
        <Box padding="6" background="surface-action-subtle" borderColor="border-action" borderWidth="0 0 0 4">
            <VStack gap="4">
                <Heading size="small">{t('inntektenDin.forventetInntektIAar.tittel')}</Heading>

                <List>
                    {watch('skalGaaAvMedAlderspensjon.valg') === IValg.JA ? (
                        <List.Item>
                            {t('inntektenDin.forventetInntektIAar.innhold.li1.skalGaaAvMedAlderspensjon')}
                        </List.Item>
                    ) : (
                        <>
                            {fyllerSekstiSyvIAar(bruker) ? (
                                <List.Item>
                                    {t('inntektenDin.forventetInntektIAar.innhold.li1.fyllerSekstiSyvIAar')}
                                </List.Item>
                            ) : (
                                <>
                                    <List.Item>{t('inntektenDin.forventetInntektIAar.innhold.li1')}</List.Item>
                                    <List.Item>{t('inntektenDin.forventetInntektIAar.innhold.li2')}</List.Item>
                                </>
                            )}
                        </>
                    )}
                    <List.Item>{t('inntektenDin.forventetInntektIAar.innhold.li3')}</List.Item>
                </List>

                <VStack gap="2">
                    <RHFInntektInput
                        name={'forventetInntektIAar.arbeidsinntekt'}
                        label={t('inntektenDin.forventetInntektIAar.arbeidsinntekt')}
                    />
                    <ArbeidsinntekterDuSkalFylleUtReadMore />
                </VStack>

                <VStack gap="2">
                    <RHFInntektInput
                        name={'forventetInntektIAar.naeringsinntekt.inntekt'}
                        label={t('inntektenDin.forventetInntektIAar.naeringsinntekt.inntekt')}
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
                                vetIkke
                            />
                            {forventetInntektIAar?.naeringsinntekt?.erNaeringsinntektOpptjentJevnt?.valg ===
                                IValg.NEI && (
                                <RHFInputArea
                                    name={
                                        'forventetInntektIAar.naeringsinntekt.erNaeringsinntektOpptjentJevnt.beskrivelse'
                                    }
                                    label={t(
                                        'inntektenDin.forventetInntektIAar.naeringsinntekt.erNaeringsinntektOpptjentJevnt.beskrivelse'
                                    )}
                                    description={t(
                                        'inntektenDin.forventetInntektIAar.naeringsinntekt.erNaeringsinntektOpptjentJevnt.beskrivelse.beskrivelse'
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
                            name={'forventetInntektIAar.afpInntekt.inntekt'}
                            label={t('inntektenDin.forventetInntektIAar.afpInntekt.inntekt')}
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
                    <RHFInntektInput
                        name={'forventetInntektIAar.inntektFraUtland'}
                        label={t('inntektenDin.forventetInntektIAar.inntektFraUtland')}
                        description={t('inntektenDin.forventetInntektIAar.inntektFraUtland.beskrivelse')}
                    />
                    <InntekterFraUtlandDuSkalFylleUt />
                </VStack>

                <RHFSpoersmaalRadio
                    name={'forventetInntektIAar.andreInntekter.valg'}
                    legend={t('inntektenDin.forventetInntektIAar.andreInntekter.valg')}
                    vetIkke
                />
                {forventetInntektIAar?.andreInntekter?.valg === IValg.JA && (
                    <>
                        <RHFInntektInput
                            name={'forventetInntektIAar.andreInntekter.inntekt'}
                            label={t('inntektenDin.forventetInntektIAar.andreInntekter.inntekt')}
                        />
                        <RHFInputArea
                            name={'forventetInntektIAar.andreInntekter.beskrivelse'}
                            label={t('inntektenDin.forventetInntektIAar.andreInntekter.beskrivelse')}
                            visPersonopplysningerVarsel={false}
                            maxLength={1000}
                        />
                    </>
                )}

                <RHFSpoersmaalRadio
                    name={'forventetInntektIAar.noeSomKanPaavirkeInntekten.valg'}
                    legend={t('inntektenDin.forventetInntektIAar.noeSomKanPaavirkeInntekten.valg')}
                    vetIkke
                />
                {forventetInntektIAar?.noeSomKanPaavirkeInntekten?.valg === IValg.JA && (
                    <VStack gap="4">
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
                            <RHFInputArea
                                name={'forventetInntektIAar.noeSomKanPaavirkeInntekten.beskrivelse'}
                                label={t('inntektenDin.forventetInntektIAar.noeSomKanPaavirkeInntekten.beskrivelse')}
                                visPersonopplysningerVarsel={false}
                                maxLength={1000}
                            />
                        )}
                    </VStack>
                )}
            </VStack>
        </Box>
    )
}
