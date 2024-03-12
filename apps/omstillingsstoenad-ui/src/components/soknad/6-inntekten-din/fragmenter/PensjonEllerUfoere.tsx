import React from 'react'
import { Heading, ReadMore, HGrid } from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { RHFCheckboksGruppe } from '../../../felles/rhf/RHFCheckboksPanelGruppe'
import { IInntekt, PensjonEllerTrygd, PensjonsYtelse } from '../../../../typer/inntekt'
import { useFormContext } from 'react-hook-form'
import { RHFInput, RHFNumberInput } from '../../../felles/rhf/RHFInput'
import { RHFSelect } from '../../../felles/rhf/RHFSelect'
import { useLand } from '../../../../hooks/useLand'
import Bredde from '../../../../typer/bredde'
import { useValutaer } from '../../../../hooks/useValutaer'

const PensjonEllerUfoere = () => {
    const { t } = useTranslation()

    const { alleLand }: { alleLand: any } = useLand()
    const { valutaer }: { valutaer: any } = useValutaer()

    const { watch } = useFormContext<IInntekt>()

    const pensjonstype = watch('pensjonEllerUfoere.pensjonstype')

    const pensjonsytelseValg = Object.values(PensjonsYtelse).map((value) => {
        return { label: t(value), value }
    })

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
                        <Heading size={'xsmall'}>{t('soekbarYtelse.tjenestepensjonsordning')}</Heading>

                        <SkjemaElement>
                            <RHFSelect
                                name={'pensjonEllerUfoere.tjenestepensjonsordning.type'}
                                label={t('inntektenDin.pensjonEllerUfoere.tjenestepensjonsordning.type')}
                                selectOptions={[
                                    {
                                        label: t('felles.velg'),
                                        value: '',
                                    },
                                ].concat(pensjonsytelseValg)}
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
                    </SkjemaGruppe>
                )}
            </>

            {pensjonstype?.includes(PensjonEllerTrygd.pensjonFraUtlandet) && (
                <>
                    <Heading size={'xsmall'}>{t('soekbarYtelse.pensjonFraUtlandet')}</Heading>

                    <SkjemaElement>
                        <RHFInput
                            name={'pensjonEllerUfoere.utland.type'}
                            label={t('inntektenDin.pensjonEllerUfoere.utland.type')}
                            description={t('inntektenDin.pensjonEllerUfoere.utland.type.beskrivelse')}
                            htmlSize={Bredde.S}
                        />
                    </SkjemaElement>
                    <SkjemaElement>
                        <RHFSelect
                            name={'pensjonEllerUfoere.utland.land'}
                            label={t('inntektenDin.pensjonEllerUfoere.utland.land')}
                            selectOptions={alleLand}
                        />
                    </SkjemaElement>

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
