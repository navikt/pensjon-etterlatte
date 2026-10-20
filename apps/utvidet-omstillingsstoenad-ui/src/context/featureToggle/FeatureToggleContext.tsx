import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { hentFeatureToggles } from '~api/api'

export enum FeatureToggleStatus {
    PAA = 'PAA',
    AV = 'AV',
    UDEFINERT = 'UDEFINERT',
    HENTING_FEILET = 'HENTING_FEILET',
}

export enum FeatureToggleNavn {
    OMS_SOEKNAD_NYTT_INNTEKT_STEG = 'oms-soeknad-nytt-inntekt-steg'
}

export interface FeatureToggle {
    name: FeatureToggleNavn
    status: FeatureToggleStatus
}

const initialFeatureTogglesState: Array<FeatureToggle> = []

const featureTogglesContext = createContext<Array<FeatureToggle>>(initialFeatureTogglesState)

export const ProvideFeatureToggleContext = ({ children }: { children: ReactNode | Array<ReactNode>}) => {
    const [featureToggles, setFeatureToggles] = useState<Array<FeatureToggle>>(initialFeatureTogglesState)

    useEffect(() => {
        hentFeatureToggles().then(setFeatureToggles)
    }, [])

    return <featureTogglesContext.Provider value={featureToggles}>{children}</featureTogglesContext.Provider>
}

export const useFeatureToggle = (featureToggleNavn: FeatureToggleNavn): FeatureToggle => {
    const funnetFeatureToggle = useContext(featureTogglesContext).find((toggle) => toggle.name === featureToggleNavn)

    if (!!funnetFeatureToggle) {
        return funnetFeatureToggle
    } else {
        return {
            name: featureToggleNavn,
            status: FeatureToggleStatus.UDEFINERT,
        }
    }
}