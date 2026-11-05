import { GlobalAlert } from '@navikt/ds-react'
import { FeatureToggleName, FeatureToggleStatus, useFeatureToggle } from '~context/featureToggle/FeatureToggleContext'
import useTranslation from '~hooks/useTranslation'

export const MaintenanceAlert = () => {
    const featureToggle = useFeatureToggle(FeatureToggleName.MAINTENANCE_WARNING)
    const { t } = useTranslation('app')

    if (featureToggle.status !== FeatureToggleStatus.ENABLED) {
        return null
    }

    return (
        <GlobalAlert status="announcement">
            <GlobalAlert.Header>
                <GlobalAlert.Title>{t('maintenanceWarningTitle')}</GlobalAlert.Title>
            </GlobalAlert.Header>
            <GlobalAlert.Content>{t('maintenanceWarningContent')}</GlobalAlert.Content>
        </GlobalAlert>
    )
}
