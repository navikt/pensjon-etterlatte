import { useTranslation } from 'react-i18next'
import React from 'react'
import { IMerOmSituasjonenDin } from '../../../../typer/situasjon'
import { useFormContext } from 'react-hook-form'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { RHFSelect } from '../../../felles/rhf/RHFSelect'
import { Heading } from '@navikt/ds-react'
import { IngenJobb } from '../../../../typer/arbeidsforhold'
import { RHFInputArea } from '../../../felles/rhf/RHFInput'

const AnnenSituasjon = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<IMerOmSituasjonenDin>()

    const annetArbeid = watch('annenSituasjon.beskrivelse')

    const annenSituasjonAlternativer = Object.values(IngenJobb).map((value) => {
        return { label: t(value), value: value }
    })

    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <Heading size={'small'}>{t('merOmSituasjonenDin.annenSituasjon.tittel')}</Heading>
            </SkjemaElement>
            <SkjemaElement>
                <RHFSelect
                    name={'annenSituasjon.beskrivelse'}
                    label={t('merOmSituasjonenDin.annenSituasjon.beskrivelse')}
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
                    <RHFInputArea
                        name={`annenSituasjon.annet.beskrivelse`}
                        label={t('merOmSituasjonenDin.annenSituasjon.annet.beskrivelse')}
                        maxLength={200}
                        className={'width-50'}
                    />
                </SkjemaElement>
            )}
        </SkjemaGruppe>
    )
}

export default AnnenSituasjon
