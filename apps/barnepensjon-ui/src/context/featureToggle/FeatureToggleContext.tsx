import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { getFeatureToggles } from '~api/api'
import { logger } from '~utils/logger'

export enum FeatureToggleStatus {
    ENABLED = 'PAA',
    DISABLED = 'AV',
    UNDEFINED = 'UDEFINERT',
    FETCH_FAILED = 'HENTING_FEILET',
}

export enum FeatureToggleName {
    MAINTENANCE_WARNING = 'etterlatte.varsling-nedetid',
}

export interface FeatureToggle {
    name: FeatureToggleName
    status: FeatureToggleStatus
}

const featureToggleContext = createContext<FeatureToggle[]>([])

export const FeatureToggleProvider = ({ children }: { children: ReactNode }) => {
    const [featureToggles, setFeatureToggles] = useState<FeatureToggle[]>([])

    useEffect(() => {
        getFeatureToggles()
            .then(setFeatureToggles)
            .catch((error: unknown) => {
                logger.generalError({ message: 'Unable to fetch feature toggles', error })
            })
    }, [])

    return <featureToggleContext.Provider value={featureToggles}>{children}</featureToggleContext.Provider>
}

export const useFeatureToggle = (name: FeatureToggleName): FeatureToggle =>
    useContext(featureToggleContext).find((toggle) => toggle.name === name) ?? {
        name,
        status: FeatureToggleStatus.UNDEFINED,
    }
