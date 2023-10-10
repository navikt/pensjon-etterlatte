import { useTranslation } from 'react-i18next'
import React from 'react'
import { Heading } from '@navikt/ds-react'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { RHFCheckboksGruppe } from '../../../felles/rhf/RHFCheckboksPanelGruppe'
import { IInntekt, PensjonsYtelse } from '../../../../typer/inntekt'
import { useFormContext } from 'react-hook-form'
import { RHFInput, RHFValutaInput } from '../../../felles/rhf/RHFInput'
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

    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <Heading size={'medium'}>{t('inntektenDin.pensjonEllerUfoere.tittel')}</Heading>
            </SkjemaElement>

            <SkjemaGruppe>
                <SkjemaElement>
                    <RHFCheckboksGruppe
                        name={'pensjonEllerUfoere.pensjonstype'}
                        legend={t('inntektenDin.pensjonEllerUfoere.pensjonstype')}
                        checkboxes={Object.values(PensjonsYtelse).map((value) => {
                            return { children: t(value), value, required: true }
                        })}
                    />
                </SkjemaElement>

                {pensjonstype?.includes(PensjonsYtelse.tjenestepensjonsordning) && (
                    <>
                        <SkjemaElement>
                            <RHFInput
                                name={'pensjonEllerUfoere.pensjonsUtbetaler'}
                                label={t('inntektenDin.pensjonEllerUfoere.pensjonsUtbetaler')}
                                description={t('inntektenDin.pensjonEllerUfoere.pensjonsUtbetaler.beskrivelse')}
                                htmlSize={Bredde.M}
                            />
                        </SkjemaElement>
                        <HvorforSpoerVi title={'pensjonEllerUfoere.pensjonsUtbetaler'}>
                            {t('inntektenDin.pensjonEllerUfoere.pensjonsUtbetaler.hvorfor')}
                        </HvorforSpoerVi>
                    </>
                )}
            </SkjemaGruppe>

            <SkjemaElement>
                <RHFSpoersmaalRadio
                    name={'pensjonEllerUfoere.utland.svar'}
                    legend={t('inntektenDin.pensjonEllerUfoere.utland.svar')}
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
                            <RHFValutaInput
                                name={'pensjonEllerUfoere.utland.beloep'}
                                label={t('inntektenDin.pensjonEllerUfoere.utland.beloep')}
                                htmlSize={Bredde.M}
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
                    <HvorforSpoerVi title={'pensjonEllerUfoere.utland.svar'}>
                        {t('inntektenDin.pensjonEllerUfoere.utland.hvorfor')}
                    </HvorforSpoerVi>
                </>
            )}
        </SkjemaGruppe>
    )
}

export default PensjonEllerUfoere
