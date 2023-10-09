import { RHFSpoersmaalRadio } from '../../../felles/rhf/RHFRadio'
import { useTranslation } from 'react-i18next'
import React from 'react'
import { ISituasjon } from '../../../../typer/situasjon'
import { RHFInput } from '../../../felles/rhf/RHFInput'
import { useFormContext } from 'react-hook-form'
import { Heading } from '@navikt/ds-react'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { RHFSelect } from '../../../felles/rhf/RHFSelect'
import { StillingType } from '../../../../typer/arbeidsforhold'
import { IValg } from '../../../../typer/Spoersmaal'
import Datovelger from '../../../felles/Datovelger'
import Bredde from '../../../../typer/bredde'

const TilbudOmJobb = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<ISituasjon>()

    const ansettelsesforhold = watch('tilbudOmJobb.ansettelsesforhold')
    const sluttdato = watch('tilbudOmJobb.midlertidig.svar')

    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <Heading size={'small'}>{t('dinSituasjon.tilbudOmJobb.tittel')}</Heading>
            </SkjemaElement>

            <RHFInput
                name={'tilbudOmJobb.arbeidssted'}
                label={t('dinSituasjon.tilbudOmJobb.arbeidssted')}
                htmlSize={Bredde.M}
            />

            <SkjemaElement>
                <RHFSelect
                    name={`tilbudOmJobb.ansettelsesforhold` as const}
                    label={t('dinSituasjon.tilbudOmJobb.ansettelsesforhold')}
                    selectOptions={[
                        { label: t('felles.velg'), value: '' },
                        {
                            label: t(StillingType.fast),
                            value: StillingType.fast,
                        },
                        {
                            label: t(StillingType.midlertidig),
                            value: StillingType.midlertidig,
                        },
                        {
                            label: t(StillingType.sesongarbeid),
                            value: StillingType.sesongarbeid,
                        },
                    ]}
                />
            </SkjemaElement>

            {ansettelsesforhold === StillingType.midlertidig && (
                <SkjemaElement>
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
