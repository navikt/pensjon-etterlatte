import { Box, Heading, HGrid, ReadMore } from '@navikt/ds-react'
import { differenceInYears } from 'date-fns'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import Datovelger from '~components/felles/Datovelger'
import { RHFCombobox } from '~components/felles/rhf/RHFCombobox'
import { useBrukerContext } from '~context/bruker/BrukerContext'
import { IBruker } from '~context/bruker/bruker'
import useCountries from '../../../../hooks/useCountries'
import { useValutaer } from '../../../../hooks/useValutaer'
import Bredde from '../../../../typer/bredde'
import { IInntekt, PensjonEllerTrygd, PensjonsYtelse } from '../../../../typer/inntekt'
import { RHFCheckboksGruppe } from '../../../felles/rhf/RHFCheckboksPanelGruppe'
import { RHFInput, RHFInputArea, RHFNumberInput } from '../../../felles/rhf/RHFInput'
import { RHFSelect } from '../../../felles/rhf/RHFSelect'

export const skalViseAFPOffentligFelter = (bruker: IBruker, tjenestepensjonsOrdningValgt?: PensjonsYtelse[]) => {
    const harValgtAFPOffentligTjenestepensjon =
        !!tjenestepensjonsOrdningValgt &&
        tjenestepensjonsOrdningValgt.includes(PensjonsYtelse.avtalefestetPensjonOffentlig)
    // AFP for 2025 sier at bruker må være eldre enn 61 og være født i 1963 eller senere
    const brukersAlderErRiktig =
        !!bruker.foedselsdato &&
        differenceInYears(new Date(), bruker.foedselsdato) >= 62 &&
        !!bruker.foedselsaar &&
        bruker.foedselsaar <= 1963

    return harValgtAFPOffentligTjenestepensjon && brukersAlderErRiktig
}

const PensjonEllerUfoere = () => {
    const { t } = useTranslation()
    // biome-ignore lint/suspicious/noExplicitAny: gammel kode, venter med å fikse
    const { allCountries }: { allCountries: any } = useCountries()
    // biome-ignore lint/suspicious/noExplicitAny: gammel kode, venter med å fikse
    const { valutaer }: { valutaer: any } = useValutaer()

    const { watch } = useFormContext<IInntekt>()
    const bruker = useBrukerContext()

    const pensjonstype = watch('pensjonEllerUfoere.pensjonstype')

    return (
        <Box marginBlock="0 12">
            <Box marginBlock="4">
                <Heading size={'medium'}>{t('inntektenDin.pensjonEllerUfoere.tittel')}</Heading>
            </Box>

            <>
                <Box marginBlock="4">
                    <RHFCheckboksGruppe
                        name={'pensjonEllerUfoere.pensjonstype'}
                        legend={t('inntektenDin.pensjonEllerUfoere.pensjonstype')}
                        checkboxes={Object.values(PensjonEllerTrygd).map((value) => {
                            return { children: t(value), value, required: true }
                        })}
                    />
                </Box>

                {pensjonstype?.includes(PensjonEllerTrygd.tjenestepensjonsordning) && (
                    <Box
                        borderColor={'border-info'}
                        borderWidth={'0 0 0 4'}
                        background={'surface-selected'}
                        padding="4"
                        marginBlock="0 12"
                    >
                        <Heading size={'small'}>{t('soekbarYtelse.tjenestepensjonsordning')}</Heading>

                        <Box marginBlock="4">
                            <RHFCheckboksGruppe
                                name={'pensjonEllerUfoere.tjenestepensjonsordning.type'}
                                legend={t('inntektenDin.pensjonEllerUfoere.tjenestepensjonsordning.type')}
                                checkboxes={Object.values(PensjonsYtelse).map((value) => {
                                    return { children: t(value), value, required: true }
                                })}
                            />
                        </Box>
                        <Box marginBlock="4">
                            <RHFInputArea
                                name={'pensjonEllerUfoere.tjenestepensjonsordning.utbetaler'}
                                label={t('inntektenDin.pensjonEllerUfoere.tjenestepensjonsordning.utbetaler')}
                                description={t(
                                    'inntektenDin.pensjonEllerUfoere.tjenestepensjonsordning.utbetaler.beskrivelse'
                                )}
                                visPersonopplysningerVarsel={false}
                                maxLength={200}
                            />
                        </Box>
                        <ReadMore header={t('hvorforSpoerVi')}>
                            {t('inntektenDin.pensjonEllerUfoere.pensjonsUtbetaler.hvorfor')}
                        </ReadMore>

                        {skalViseAFPOffentligFelter(
                            bruker.state,
                            watch('pensjonEllerUfoere.tjenestepensjonsordning.type')
                        ) && (
                            <>
                                <Box marginBlock="4">
                                    <Datovelger
                                        name={'pensjonEllerUfoere.tjenestepensjonsordning.afpOffentlig.innvilget'}
                                        label={t(
                                            'inntektenDin.pensjonEllerUfoere.tjenestepensjonsordning.afpOffentlig.innvilget'
                                        )}
                                        minDate={bruker.state.foedselsdato}
                                        maxDate={new Date()}
                                    />
                                </Box>
                                <Box marginBlock="4">
                                    <RHFNumberInput
                                        name={'pensjonEllerUfoere.tjenestepensjonsordning.afpOffentlig.beloep'}
                                        label={t(
                                            'inntektenDin.pensjonEllerUfoere.tjenestepensjonsordning.afpOffentlig.beloep'
                                        )}
                                        description={t(
                                            'inntektenDin.pensjonEllerUfoere.tjenestepensjonsordning.afpOffentlig.beloep.beskrivelse'
                                        )}
                                        htmlSize={Bredde.M}
                                    />
                                </Box>
                                <ReadMore
                                    header={t(
                                        'inntektenDin.pensjonEllerUfoere.tjenestepensjonsordning.afpOffentlig.innvilgetIAar.tittel'
                                    )}
                                >
                                    {t(
                                        'inntektenDin.pensjonEllerUfoere.tjenestepensjonsordning.afpOffentlig.innvilgetIAar.innhold'
                                    )}
                                </ReadMore>
                            </>
                        )}
                    </Box>
                )}
            </>

            {pensjonstype?.includes(PensjonEllerTrygd.pensjonFraUtlandet) && (
                <>
                    <Heading size={'small'}>{t('soekbarYtelse.pensjonFraUtlandet')}</Heading>

                    <Box marginBlock="4">
                        <RHFInput
                            name={'pensjonEllerUfoere.utland.type'}
                            label={t('inntektenDin.pensjonEllerUfoere.utland.type')}
                            description={t('inntektenDin.pensjonEllerUfoere.utland.type.beskrivelse')}
                            htmlSize={Bredde.S}
                        />
                    </Box>
                    <Box maxWidth="14rem" marginBlock="4">
                        <RHFCombobox
                            name={'pensjonEllerUfoere.utland.land'}
                            label={t('inntektenDin.pensjonEllerUfoere.utland.land')}
                            options={allCountries}
                        />
                    </Box>

                    <HGrid gap={'2'} columns={{ xs: 1, sm: 'repeat(auto-fit, minmax(10rem, 14rem))' }} align={'start'}>
                        <Box marginBlock="4">
                            <RHFNumberInput
                                name={'pensjonEllerUfoere.utland.beloep'}
                                label={t('felles.aarligBeloep')}
                            />
                        </Box>

                        <Box marginBlock="4">
                            <RHFSelect
                                name={'pensjonEllerUfoere.utland.valuta'}
                                label={t('felles.velgValuta')}
                                selectOptions={valutaer}
                            />
                        </Box>
                    </HGrid>
                </>
            )}
        </Box>
    )
}

export default PensjonEllerUfoere
