import { Box, Heading, List, ReadMore, VStack } from '@navikt/ds-react'
import { differenceInYears } from 'date-fns'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { RHFInntektInput, RHFInput, RHFInputArea, RHFNumberInput } from '~components/felles/rhf/RHFInput'
import { RHFSpoersmaalRadio } from '~components/felles/rhf/RHFRadio'
import { ArbeidsinntekterDuSkalFylleUtReadMore } from '~components/soknad/6-inntekten-din/fragmenter/felles/ArbeidsinntekterDuSkalFylleUtReadMore'
import { InntekterFraUtlandDuSkalFylleUt } from '~components/soknad/6-inntekten-din/fragmenter/felles/InntekterFraUtlandDuSkalFylleUt'
import { NaeringsinntekterDuSkalFylleUtReadMore } from '~components/soknad/6-inntekten-din/fragmenter/felles/NaeringsinntekterDuSkalFylleUtReadMore'
import { useBrukerContext } from '~context/bruker/BrukerContext'
import { IBruker } from '~context/bruker/bruker'
import Bredde from '~typer/bredde'
import { IInntekt } from '~typer/inntekt'
import { IValg } from '~typer/Spoersmaal'

export const InntektFremTilDoedsfallet = () => {
    const { t } = useTranslation()

    const { state: bruker } = useBrukerContext()

    const { watch } = useFormContext<IInntekt>()

    const inntektFremTilDoedsfallet = watch('inntektFremTilDoedsfallet')

    // Inntekts felter for Avtalefestet alderspensjon skal kun vises hvis bruker er eldre enn 62 år
    // TODO: skal det være like regler på tvers av skjemaene her?
    const skalViseAfpFelter = (bruker: IBruker): boolean => {
        if (!!bruker.foedselsdato) {
            const alder = differenceInYears(new Date(), bruker.foedselsdato)
            return alder > 62
        } else {
            return false
        }
    }

    return (
        <Box padding="6" background="surface-action-subtle" borderColor="border-action" borderWidth="0 0 0 4">
            <VStack gap="4">
                <Heading size="small">{t('inntektenDin.inntektFremTilDoedsfallet.tittel')}</Heading>

                <List>
                    <List.Item>{t('inntektenDin.inntektFremTilDoedsfallet.innhold.li1')}</List.Item>
                    <List.Item>{t('inntektenDin.inntektFremTilDoedsfallet.innhold.li2')}</List.Item>
                    <List.Item>{t('inntektenDin.inntektFremTilDoedsfallet.innhold.li3')}</List.Item>
                </List>

                <VStack gap="2">
                    <RHFInntektInput
                        name={'inntektFremTilDoedsfallet.arbeidsinntekt'}
                        label={t('inntektenDin.inntektFremTilDoedsfallet.arbeidsinntekt')}
                    />
                    <ArbeidsinntekterDuSkalFylleUtReadMore />
                </VStack>

                <VStack gap="2">
                    <RHFInntektInput
                        name={'inntektFremTilDoedsfallet.naeringsinntekt.inntekt'}
                        label={t('inntektenDin.inntektFremTilDoedsfallet.naeringsinntekt.inntekt')}
                    />
                    <NaeringsinntekterDuSkalFylleUtReadMore />
                </VStack>
                {!!inntektFremTilDoedsfallet?.naeringsinntekt?.inntekt &&
                    inntektFremTilDoedsfallet?.naeringsinntekt?.inntekt !== '0' && (
                        <>
                            <RHFSpoersmaalRadio
                                name={'inntektFremTilDoedsfallet.naeringsinntekt.erNaeringsinntektOpptjentJevnt.valg'}
                                legend={t(
                                    'inntektenDin.inntektFremTilDoedsfallet.naeringsinntekt.erNaeringsinntektOpptjentJevnt.valg'
                                )}
                            />
                            {inntektFremTilDoedsfallet?.naeringsinntekt?.erNaeringsinntektOpptjentJevnt?.valg ===
                                IValg.NEI && (
                                <RHFInputArea
                                    name={
                                        'inntektFremTilDoedsfallet.naeringsinntekt.erNaeringsinntektOpptjentJevnt.beskrivelse'
                                    }
                                    label={t(
                                        'inntektenDin.inntektFremTilDoedsfallet.naeringsinntekt.erNaeringsinntektOpptjentJevnt.beskrivelse'
                                    )}
                                    description={t(
                                        'inntektenDin.inntektFremTilDoedsfallet.naeringsinntekt.erNaeringsinntektOpptjentJevnt.beskrivelse.beskrivelse'
                                    )}
                                />
                            )}
                        </>
                    )}

                {skalViseAfpFelter(bruker) && (
                    <VStack gap="2">
                        <RHFInntektInput
                            name={'inntektFremTilDoedsfallet.afpInntekt.inntekt'}
                            label={t('inntektenDin.inntektFremTilDoedsfallet.afpInntekt.inntekt')}
                        />
                        {!!inntektFremTilDoedsfallet?.afpInntekt?.inntekt &&
                            inntektFremTilDoedsfallet?.afpInntekt?.inntekt !== '0' && (
                                <RHFInput
                                    name={'inntektFremTilDoedsfallet.afpInntekt.tjenesteordning'}
                                    label={t('inntektenDin.inntektFremTilDoedsfallet.afpInntekt.tjenesteordning')}
                                    description={t(
                                        'inntektenDin.inntektFremTilDoedsfallet.afpInntekt.tjenesteordning.beskrivelse'
                                    )}
                                    htmlSize={Bredde.M}
                                />
                            )}
                    </VStack>
                )}

                <VStack gap="2">
                    <RHFInntektInput
                        name={'inntektFremTilDoedsfallet.inntektFraUtland'}
                        label={t('inntektenDin.inntektFremTilDoedsfallet.inntektFraUtland')}
                        description={t('inntektenDin.inntektFremTilDoedsfallet.inntektFraUtland.beskrivelse')}
                    />
                    <InntekterFraUtlandDuSkalFylleUt />
                </VStack>

                <RHFSpoersmaalRadio
                    name={'inntektFremTilDoedsfallet.andreInntekter.valg'}
                    legend={t('inntektenDin.inntektFremTilDoedsfallet.andreInntekter.valg')}
                />
                {inntektFremTilDoedsfallet?.andreInntekter?.valg === IValg.JA && (
                    <>
                        <RHFInntektInput
                            name={'inntektFremTilDoedsfallet.andreInntekter.inntekt'}
                            label={t('inntektenDin.inntektFremTilDoedsfallet.andreInntekter.inntekt')}
                        />
                        <RHFInputArea
                            name={'inntektFremTilDoedsfallet.andreInntekter.beskrivelse'}
                            label={t('inntektenDin.inntektFremTilDoedsfallet.andreInntekter.beskrivelse')}
                        />
                    </>
                )}
            </VStack>
        </Box>
    )
}
