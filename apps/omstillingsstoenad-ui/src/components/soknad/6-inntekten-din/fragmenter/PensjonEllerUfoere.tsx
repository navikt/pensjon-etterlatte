import { useTranslation } from 'react-i18next'
import React from 'react'
import { Heading } from '@navikt/ds-react'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { RHFCheckboksGruppe } from '../../../felles/rhf/RHFCheckboksPanelGruppe'
import { IInntekt, PensjonEllerTrygd, PensjonsYtelse } from '../../../../typer/inntekt'
import { useFormContext } from 'react-hook-form'
import { RHFInput, RHFNumberInput } from '../../../felles/rhf/RHFInput'
import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import { IValg } from '../../../../typer/Spoersmaal'
import { RHFSelect } from '../../../felles/rhf/RHFSelect'
import { useLand } from '../../../../hooks/useLand'
import Bredde from '../../../../typer/bredde'
import HvorforSpoerVi from '../../../felles/HvorforSpoerVi'
import { SkjemaGruppeRad } from '../../../felles/StyledComponents'

const PensjonEllerUfoere = () => {
    const { t } = useTranslation()

    const { alleLand }: { alleLand: any } = useLand()

    const { watch } = useFormContext<IInntekt>()

    const pensjonstype = watch('pensjonEllerUfoere.pensjonstype')
    const utland = watch('pensjonEllerUfoere.utland.svar')

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
                    <>
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
                        <HvorforSpoerVi title={'pensjonEllerUfoere.pensjonsUtbetaler'}>
                            {t('inntektenDin.pensjonEllerUfoere.pensjonsUtbetaler.hvorfor')}
                        </HvorforSpoerVi>
                    </>
                )}
            </>

            <SkjemaElement>
                <RHFSpoersmaalRadio
                    name={'pensjonEllerUfoere.utland.svar'}
                    legend={t('inntektenDin.pensjonEllerUfoere.utland.svar')}
                    description={t('inntektenDin.pensjonEllerUfoere.utland.hvorfor')}
                />
            </SkjemaElement>
            {utland === IValg.JA && (
                <>
                    <SkjemaElement>
                        <RHFInput
                            name={'pensjonEllerUfoere.utland.type'}
                            label={t('inntektenDin.pensjonEllerUfoere.utland.type')}
                            description={t('inntektenDin.pensjonEllerUfoere.utland.type.beskrivelse')}
                            htmlSize={Bredde.M}
                        />
                    </SkjemaElement>
                    <SkjemaElement>
                        <RHFSelect
                            name={'pensjonEllerUfoere.utland.land'}
                            label={t('inntektenDin.pensjonEllerUfoere.utland.land')}
                            selectOptions={alleLand}
                        />
                    </SkjemaElement>

                    <SkjemaGruppeRad>
                        <SkjemaElement>
                            <RHFNumberInput
                                name={'pensjonEllerUfoere.utland.beloep'}
                                label={t('inntektenDin.pensjonEllerUfoere.utland.beloep')}
                                htmlSize={Bredde.S}
                            />
                        </SkjemaElement>

                        <SkjemaElement>
                            <RHFInput
                                name={'pensjonEllerUfoere.utland.valuta'}
                                label={t('inntektenDin.pensjonEllerUfoere.utland.valuta')}
                                htmlSize={Bredde.S}
                            />
                        </SkjemaElement>
                    </SkjemaGruppeRad>
                </>
            )}
        </SkjemaGruppe>
    )
}

export default PensjonEllerUfoere
