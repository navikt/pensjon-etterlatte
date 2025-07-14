import { Box, Heading } from '@navikt/ds-react'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { IngenJobb } from '../../../../typer/arbeidsforhold'
import { IMerOmSituasjonenDin } from '../../../../typer/situasjon'
import { RHFCheckboksGruppe } from '../../../felles/rhf/RHFCheckboksPanelGruppe'
import { RHFInputArea } from '../../../felles/rhf/RHFInput'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'

const AnnenSituasjon = () => {
    const { t } = useTranslation()

    const { watch } = useFormContext<IMerOmSituasjonenDin>()

    const annetArbeid = watch('annenSituasjon.beskrivelse')

    const annenSituasjonAlternativer = Object.values(IngenJobb).map((value) => {
        return { children: t(value), value: value, required: true }
    })

    return (
        <SkjemaGruppe>
            <Box marginBlock="4">
                <Heading size={'small'}>{t('jobbStatus.ingen')}</Heading>
            </Box>
            <Box marginBlock="4">
                <RHFCheckboksGruppe
                    name={'annenSituasjon.beskrivelse'}
                    legend={t('merOmSituasjonenDin.annenSituasjon.beskrivelse')}
                    checkboxes={annenSituasjonAlternativer}
                />
            </Box>
            {!!annetArbeid?.length && (
                <Box marginBlock="4">
                    <RHFInputArea
                        name={`annenSituasjon.annet.beskrivelse`}
                        label={t('merOmSituasjonenDin.annenSituasjon.annet.beskrivelse')}
                        maxLength={200}
                        className={'width-50'}
                    />
                </Box>
            )}
        </SkjemaGruppe>
    )
}

export default AnnenSituasjon
