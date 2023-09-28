import { useTranslation } from 'react-i18next'
import React from 'react'
import { ISituasjon } from '../../../../typer/situasjon'
import { useFormContext } from 'react-hook-form'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { RHFSelect } from '../../../felles/rhf/RHFSelect'
import { Heading } from '@navikt/ds-react'
import { IngenJobb } from '../../../../typer/arbeidsforhold'
import { RHFInput } from '../../../felles/rhf/RHFInput'

const AnnenSituasjon = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<ISituasjon>()

    const annetArbeid = watch('annenSituasjon.beskrivelse')

    const annenSituasjonAlternativer = Object.values(IngenJobb).map((value) => {
        return { label: t(value), value: value }
    })

    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <Heading size={'small'}>{t('dinSituasjon.annenSituasjon.tittel')}</Heading>
            </SkjemaElement>
            <SkjemaElement>
                <RHFSelect
                    name={'annenSituasjon.beskrivelse'}
                    label={t('dinSituasjon.annenSituasjon.beskrivelse')}
                    selectOptions={[
                        {
                            label: t('felles.velg'),
                            value: '',
                        },
                    ].concat(annenSituasjonAlternativer)}
                />
            </SkjemaElement>
            {annetArbeid === IngenJobb.annet && (
                <SkjemaElement>
                    <RHFInput
                        name={'annenSituasjon.annet.beskrivelse'}
                        label={t('dinSituasjon.annenSituasjon.annet.beskrivelse')}
                    />
                </SkjemaElement>
            )}
        </SkjemaGruppe>
    )
}

export default AnnenSituasjon
