import { hentFeatureToggles } from '~api/api'
import { FeatureToggle, FeatureToggleNavn, FeatureToggleStatus } from '~context/featureToggle/FeatureToggleContext'

export const finnFeatureToggle = async (featureToggleNavn: FeatureToggleNavn): Promise<FeatureToggle> => {
    const featureToggles = await hentFeatureToggles()
    const funnetFeatureToggle = featureToggles.find((toggle: FeatureToggle) => toggle.name === featureToggleNavn)

    if (!!funnetFeatureToggle) {
        return funnetFeatureToggle
    } else {
        return {
            name: featureToggleNavn,
            status: FeatureToggleStatus.UDEFINERT,
        }
    }
}
