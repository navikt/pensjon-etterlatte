import { Box, Heading, ReadMore } from '@navikt/ds-react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Utdanning } from '../../../../typer/situasjon'
import { RHFCheckboksGruppe } from '../../../felles/rhf/RHFCheckboksPanelGruppe'

const HoeyesteUtdanning = () => {
    const { t } = useTranslation()

    return (
        <Box marginBlock="space-0 space-48">
            <Box marginBlock="space-16">
                <Heading size={'small'}>{t('merOmSituasjonenDin.utdanning.tittelFullfoert')}</Heading>
            </Box>
            <RHFCheckboksGruppe
                name={'utdanning.hoyesteFullfoerteUtdanning'}
                legend={t('merOmSituasjonenDin.utdanning.hoyesteFullfoerteUtdanning')}
                description={t('merOmSituasjonenDin.utdanning.hoyesteFullfoerteUtdanning.beskrivelse')}
                checkboxes={Object.values(Utdanning).map((value) => {
                    return { children: t(value), value, required: true }
                })}
            />
            <ReadMore header={t('hvorforSpoerVi')}>{t('merOmSituasjonenDin.utdanning.hvorfor')}</ReadMore>
        </Box>
    )
}

export default HoeyesteUtdanning
