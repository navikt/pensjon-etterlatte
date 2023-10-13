import { RHFRadio, RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import { useTranslation } from 'react-i18next'
import React from 'react'
import { ISituasjon } from '../../../../typer/situasjon'
import { RHFInput, RHFNumberInput, RHFProsentInput } from '../../../felles/rhf/RHFInput'
import { useFormContext } from 'react-hook-form'
import { Detail, Heading, Label, RadioProps } from '@navikt/ds-react'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { Arbeidsmengde, StillingType } from '../../../../typer/arbeidsforhold'
import { IValg } from '../../../../typer/Spoersmaal'
import Datovelger from '../../../felles/Datovelger'
import Bredde from '../../../../typer/bredde'
import { RHFSelect } from '../../../felles/rhf/RHFSelect'
import { NumberSelectRad } from '../../../felles/StyledComponents'

const TilbudOmJobb = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<ISituasjon>()

    const ansettelsesforhold = watch('tilbudOmJobb.ansettelsesforhold')
    const sluttdato = watch('tilbudOmJobb.midlertidig.svar')

    const arbeidsmengdeValg = Object.values(Arbeidsmengde).map((value) => {
        return { label: t(value), value }
    })

    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <Heading size={'small'}>{t('dinSituasjon.tilbudOmJobb.tittel')}</Heading>
            </SkjemaElement>

            <SkjemaElement>
                <RHFInput
                    name={'tilbudOmJobb.arbeidssted'}
                    label={t('dinSituasjon.tilbudOmJobb.arbeidssted')}
                    htmlSize={Bredde.M}
                />
            </SkjemaElement>

            <SkjemaGruppe>
                <Label>{t('dinSituasjon.tilbudOmJobb.ansettelsesdato.tittel')}</Label>
                <Datovelger
                    name={`tilbudOmJobb.ansettelsesdato`}
                    label={t('dinSituasjon.tilbudOmJobb.ansettelsesdato')}
                    minDate={new Date()}
                />
            </SkjemaGruppe>

            <SkjemaElement>
                <RHFRadio
                    name={`tilbudOmJobb.ansettelsesforhold` as const}
                    legend={t('dinSituasjon.tilbudOmJobb.ansettelsesforhold')}
                >
                    {Object.values(StillingType).map((value) => {
                        return { children: t(value), value } as RadioProps
                    })}
                </RHFRadio>
            </SkjemaElement>

            {ansettelsesforhold === StillingType.fast && (
                <SkjemaElement>
                    <SkjemaElement>
                        <Heading size={'xsmall'}>{t('dinSituasjon.tilbudOmJobb.ansettelsesforhold.tittel')}</Heading>
                        <Detail>{t('dinSituasjon.tilbudOmJobb.ansettelsesforhold.beskrivelse.fast')}</Detail>
                    </SkjemaElement>
                    <RHFProsentInput
                        name={`tilbudOmJobb.arbeidsmengde.svar` as const}
                        label={t('dinSituasjon.tilbudOmJobb.arbeidsmengde.svar.fast')}
                        htmlSize={Bredde.XS}
                    />
                </SkjemaElement>
            )}

            {(ansettelsesforhold === StillingType.midlertidig ||
                ansettelsesforhold === StillingType.tilkallingsvikar) && (
                <SkjemaElement>
                    <SkjemaElement>
                        <Heading size={'xsmall'}>{t('dinSituasjon.tilbudOmJobb.ansettelsesforhold.tittel')}</Heading>
                        <Detail>{t('dinSituasjon.tilbudOmJobb.ansettelsesforhold.beskrivelse.midlertidig')}</Detail>
                    </SkjemaElement>
                    <NumberSelectRad>
                        <RHFNumberInput
                            name={`tilbudOmJobb.arbeidsmengde.svar` as const}
                            label={t('dinSituasjon.tilbudOmJobb.arbeidsmengde.svar')}
                            htmlSize={Bredde.S}
                        />
                        <RHFSelect
                            name={`tilbudOmJobb.arbeidsmengde.type` as const}
                            selectOptions={[
                                {
                                    label: t('felles.velg'),
                                    value: '',
                                },
                            ].concat(arbeidsmengdeValg)}
                            label={t('felles.velg.tittel')}
                        />
                    </NumberSelectRad>
                    <RHFSpoersmaalRadio
                        name={`tilbudOmJobb.midlertidig.svar` as const}
                        legend={t('dinSituasjon.tilbudOmJobb.midlertidig.svar')}
                    />
                    {sluttdato === IValg.JA && (
                        <Datovelger
                            name={`tilbudOmJobb.midlertidig.sluttdatoVelger`}
                            label={t('dinSituasjon.tilbudOmJobb.midlertidig.sluttdatoVelger')}
                            minDate={new Date()}
                        />
                    )}
                </SkjemaElement>
            )}
        </SkjemaGruppe>
    )
}

export default TilbudOmJobb
