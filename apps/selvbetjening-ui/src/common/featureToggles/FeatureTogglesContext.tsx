import { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { apiURL, poster } from '../api/api.ts'
import { logger } from '../logger/logger.ts'

export enum FeatureToggleStatus {
    PAA = 'PAA',
    AV = 'AV',
    UDEFINERT = 'UDEFINERT',
    HENTING_FEILET = 'HENTING_FEILET',
}
export enum FeatureToggleNavn {
    OMS_INNTEKTSJUSTERING_SKJEMA = 'oms-inntektsjustering-skjema',
    OMS_MELD_INN_ENDRING_SKJEMA = 'oms-meld-inn-endring-skjema',
    ETTEROPPGJOER = 'etteroppgjoer',
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
        return await poster(`${apiURL}/feature`, { body: Object.values(FeatureToggleNavn) })
            .then((res) => ([200, 304].includes(res.status) ? res.json() : []))
            .catch((e) => {
                logger.generalError(e as object)
                return []
            })
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
