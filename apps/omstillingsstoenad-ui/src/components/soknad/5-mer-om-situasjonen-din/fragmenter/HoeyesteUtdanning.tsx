import { useTranslation } from 'react-i18next'
import React from 'react'
import { Utdanning } from '../../../../typer/situasjon'
import { Heading, ReadMore } from '@navikt/ds-react'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import { RHFCheckboksGruppe } from '../../../felles/rhf/RHFCheckboksPanelGruppe'

const HoeyesteUtdanning = () => {
    const { t } = useTranslation()

    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <Heading size={'small'}>{t('merOmSituasjonenDin.utdanning.tittelFullfoert')}</Heading>
            </SkjemaElement>

            <RHFCheckboksGruppe
                    name={'utdanning.hoyesteFullfoerteUtdanning'}
                    legend={t('merOmSituasjonenDin.utdanning.hoyesteFullfoerteUtdanning')}
                    description={t('merOmSituasjonenDin.utdanning.hoyesteFullfoerteUtdanning.beskrivelse')}
                    checkboxes={Object.values(Utdanning).map((value) => {
                        return { children: t(value), value, required: true }
                    })}
            />

            <ReadMore header={t('hvorforSpoerVi')}>
                {t('merOmSituasjonenDin.utdanning.hvorfor')}
            </ReadMore>
        </SkjemaGruppe>
    )
}

export default HoeyesteUtdanning
