import { Box, HGrid, Heading, ReadMore } from '@navikt/ds-react'
import { differenceInYears } from 'date-fns'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { RHFCombobox } from '~components/felles/rhf/RHFCombobox'
import { useBrukerContext } from '~context/bruker/BrukerContext'
import useCountries from '../../../../hooks/useCountries'
import { useValutaer } from '../../../../hooks/useValutaer'
import Bredde from '../../../../typer/bredde'
import { IInntekt, PensjonEllerTrygd, PensjonsYtelse } from '../../../../typer/inntekt'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { RHFCheckboksGruppe } from '../../../felles/rhf/RHFCheckboksPanelGruppe'
import { RHFInput, RHFNumberInput } from '../../../felles/rhf/RHFInput'
import { RHFSelect } from '../../../felles/rhf/RHFSelect'

const PensjonEllerUfoere = () => {
    const { t } = useTranslation()
    // biome-ignore lint/suspicious/noExplicitAny: gammel kode, venter med å fikse
    const { allCountries }: { allCountries: any } = useCountries()
    // biome-ignore lint/suspicious/noExplicitAny: gammel kode, venter med å fikse
    const { valutaer }: { valutaer: any } = useValutaer()

    const { watch } = useFormContext<IInntekt>()
    const bruker = useBrukerContext()

    const pensjonstype = watch('pensjonEllerUfoere.pensjonstype')

    const skalViseAFPOffentligFelter = (tjenestepensjonsOrdningValgt?: PensjonsYtelse) => {
        const harValgtAFPOffentligTjenestepensjon =
            !!tjenestepensjonsOrdningValgt &&
            tjenestepensjonsOrdningValgt.includes(PensjonsYtelse.avtalefestetPensjonOffentlig)
        // AFP for 2025 sier at bruker må være eldre enn 61 og være født i 1963 eller senere
        const brukersAlderErRiktig =
            !!bruker.state.foedselsdato &&
            differenceInYears(new Date(), bruker.state.foedselsdato) >= 62 &&
            !!bruker.state.foedselsaar &&
            bruker.state.foedselsaar <= 1963

        return harValgtAFPOffentligTjenestepensjon && brukersAlderErRiktig
    }

    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <Heading size={'medium'}>{t('inntektenDin.pensjonEllerUfoere.tittel')}</Heading>
            </SkjemaElement>

            <>
                <SkjemaElement>
                    <RHFCheckboksGruppe
                        name={'pensjonEllerUfoere.pensjonstype'}
                        legend={t('inntektenDin.pensjonEllerUfoere.pensjonstype')}
                        checkboxes={Object.values(PensjonEllerTrygd).map((value) => {
                            return { children: t(value), value, required: true }
                        })}
                    />
                </SkjemaElement>

                {pensjonstype?.includes(PensjonEllerTrygd.tjenestepensjonsordning) && (
                    <SkjemaGruppe>
                        <Heading size={'small'}>{t('soekbarYtelse.tjenestepensjonsordning')}</Heading>

                        <SkjemaElement>
                            <RHFCheckboksGruppe
                                name={'pensjonEllerUfoere.tjenestepensjonsordning.type'}
                                legend={t('inntektenDin.pensjonEllerUfoere.tjenestepensjonsordning.type')}
                                checkboxes={Object.values(PensjonsYtelse).map((value) => {
                                    return { children: t(value), value, required: true }
                                })}
                            />
                        </SkjemaElement>
                        <SkjemaElement>
                            <RHFInput
                                name={'pensjonEllerUfoere.tjenestepensjonsordning.utbetaler'}
                                label={t('inntektenDin.pensjonEllerUfoere.tjenestepensjonsordning.utbetaler')}
                                description={t(
                                    'inntektenDin.pensjonEllerUfoere.tjenestepensjonsordning.utbetaler.beskrivelse'
                                )}
                                htmlSize={Bredde.M}
                            />
                        </SkjemaElement>
                        <ReadMore header={t('hvorforSpoerVi')}>
                            {t('inntektenDin.pensjonEllerUfoere.pensjonsUtbetaler.hvorfor')}
                        </ReadMore>

                        {skalViseAFPOffentligFelter(watch('pensjonEllerUfoere.tjenestepensjonsordning.type')) && (
                            <>
                                <SkjemaElement>Heihie</SkjemaElement>
                                <SkjemaElement>Heihie</SkjemaElement>
                            </>
                        )}
                    </SkjemaGruppe>
                )}
            </>

            {pensjonstype?.includes(PensjonEllerTrygd.pensjonFraUtlandet) && (
                <>
                    <Heading size={'small'}>{t('soekbarYtelse.pensjonFraUtlandet')}</Heading>

                    <SkjemaElement>
                        <RHFInput
                            name={'pensjonEllerUfoere.utland.type'}
                            label={t('inntektenDin.pensjonEllerUfoere.utland.type')}
                            description={t('inntektenDin.pensjonEllerUfoere.utland.type.beskrivelse')}
                            htmlSize={Bredde.S}
                        />
                    </SkjemaElement>
                    <Box maxWidth="14rem">
                        <SkjemaElement>
                            <RHFCombobox
                                name={'pensjonEllerUfoere.utland.land'}
                                label={t('inntektenDin.pensjonEllerUfoere.utland.land')}
                                options={allCountries}
                            />
                        </SkjemaElement>
                    </Box>

                    <HGrid gap={'2'} columns={{ xs: 1, sm: 'repeat(auto-fit, minmax(10rem, 14rem))' }} align={'start'}>
                        <SkjemaElement>
                            <RHFNumberInput
                                name={'pensjonEllerUfoere.utland.beloep'}
                                label={t('felles.aarligBeloep')}
                            />
                        </SkjemaElement>

                        <SkjemaElement>
                            <RHFSelect
                                name={'pensjonEllerUfoere.utland.valuta'}
                                label={t('felles.velgValuta')}
                                selectOptions={valutaer}
                            />
                        </SkjemaElement>
                    </HGrid>
                </>
            )}
        </SkjemaGruppe>
    )
}

export default PensjonEllerUfoere
