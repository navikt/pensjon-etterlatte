import { GlobalAlert } from '@navikt/ds-react'
import { useTranslation } from 'react-i18next'
import { FeatureToggleNavn, FeatureToggleStatus, useFeatureToggle } from '~context/featureToggle/FeatureToggleContext'

export const Vedlikeholdsvarsel = () => {
    const featureToggle = useFeatureToggle(FeatureToggleNavn.VEDLIKEHOLDSVARSEL)
    const { t } = useTranslation()

    if (featureToggle.status !== FeatureToggleStatus.PAA) {
        return null
    }

    return (
        <GlobalAlert status="announcement">
            <GlobalAlert.Header>
                <GlobalAlert.Title>{t('vedlikeholdsvarsel.tittel')}</GlobalAlert.Title>
            </GlobalAlert.Header>
            <GlobalAlert.Content>{t('vedlikeholdsvarsel.innhold')}</GlobalAlert.Content>
        </GlobalAlert>
    )
}
