import { useTranslation } from 'react-i18next'
import React from 'react'
import { Utdanning } from '../../../../typer/situasjon'
import { Heading } from '@navikt/ds-react'
import { SkjemaElement } from '../../../felles/SkjemaElement'
import { SkjemaGruppe } from '../../../felles/SkjemaGruppe'
import HvorforSpoerVi from '../../../felles/HvorforSpoerVi'
import { RHFCheckboksGruppe } from '../../../felles/rhf/RHFCheckboksPanelGruppe'

const HoeyesteUtdanning = () => {
    const { t } = useTranslation()

    return (
        <SkjemaGruppe>
            <SkjemaElement>
                <Heading size={'small'}>{t('dinSituasjon.utdanning.tittelFullfoert')}</Heading>
            </SkjemaElement>

            <RHFCheckboksGruppe
                    name={'utdanning.hoyesteFullfoerteUtdanning'}
                    legend={t('dinSituasjon.utdanning.hoyesteFullfoerteUtdanning')}
                    checkboxes={Object.values(Utdanning).map((value) => {
                        return { children: t(value), value, required: true }
                    })}
            />

            <HvorforSpoerVi title="dinSituasjon.utdanning.tittelFullfoert">
                {t('dinSituasjon.utdanning.hvorfor')}
            </HvorforSpoerVi>
        </SkjemaGruppe>
    )
}

export default HoeyesteUtdanning
