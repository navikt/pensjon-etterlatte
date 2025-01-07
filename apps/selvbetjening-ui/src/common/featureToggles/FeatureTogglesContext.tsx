import { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { apiURL, poster } from '../api/api.ts'
import { logger } from '../logger/logger.ts'

export enum FeatureToggleStatus {
    PAA = 'PAA',
    AV = 'AV',
    UDEFINERT = 'UDEFINERT',
    HENTING_FEILET = 'HENTING_FEILET',
}
export enum FeatureToggleNavn {
    OMS_MELD_INN_ENDRING_SKJEMA = 'oms-meld-inn-endring-skjema',
}

export interface FeatureToggle {
    name: FeatureToggleNavn
    status: FeatureToggleStatus
}

const initialFeatureTogglesState: Array<FeatureToggle> = []

const featureTogglesContext = createContext<Array<FeatureToggle>>(initialFeatureTogglesState)

export const ProvideFeatureTogglesContext = ({ children }: { children: ReactNode | Array<ReactNode> }) => {
    const [featureToggles, setFeatureToggles] = useState<Array<FeatureToggle>>(initialFeatureTogglesState)

    const hentFeatureToggles = async (): Promise<Array<FeatureToggle>> => {
        const featureToggles: Array<FeatureToggle> = []

        try {
            const res = await poster(`${apiURL}/feature`, { body: Object.values(FeatureToggleNavn) })

            if ([200, 304].includes(res.status)) {
                res.json().then((toggles) => featureToggles.concat(toggles))
            }
        } catch (e) {
            logger.generalError(e as object)
        }

        return featureToggles
    }

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
