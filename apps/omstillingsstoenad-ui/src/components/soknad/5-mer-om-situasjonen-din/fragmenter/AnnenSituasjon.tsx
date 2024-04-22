import { useTranslation } from 'react-i18next'
import React from 'react'
import { IMerOmSituasjonenDin } from '../../../../typer/situasjon'
import { useFormContext } from 'react-hook-form'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { Heading } from '@navikt/ds-react'
import { IngenJobb } from '../../../../typer/arbeidsforhold'
import { RHFInputArea } from '../../../felles/rhf/RHFInput'
import { RHFCheckboksGruppe } from '../../../felles/rhf/RHFCheckboksPanelGruppe'

const AnnenSituasjon = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<IMerOmSituasjonenDin>()

    const annetArbeid = watch('annenSituasjon.beskrivelse')

    const annenSituasjonAlternativer = Object.values(IngenJobb).map((value) => {
        return { children: t(value), value: value, required: true }
    })

    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <Heading size={'small'}>{t('jobbStatus.ingen')}</Heading>
            </SkjemaElement>
            <SkjemaElement>
                <RHFCheckboksGruppe
                    name={'annenSituasjon.beskrivelse'}
                    legend={t('merOmSituasjonenDin.annenSituasjon.beskrivelse')}
                    checkboxes={annenSituasjonAlternativer}
                />
            </SkjemaElement>
            {!!annetArbeid?.length && (
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
