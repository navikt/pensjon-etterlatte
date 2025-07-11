import { getAnalyticsInstance } from '@navikt/nav-dekoratoren-moduler'
import { useCallback } from 'react'

// Felles taksonomi for analytics https://github.com/navikt/analytics-taxonomy
export enum LogEvents {
    ALDER = 'alder',
    INGEN_OMS_SAK = 'ingen oms sak',
    KLIKK = 'klikk',
    ETTERSEND_DOKUMENTASJON_KLIKK = 'ettersend dokumentasjon klikk',
}

export enum EventType {
    LENKE_KLIKK = 'lenke klikk',
}

export const useAnalytics = () => {
    const track = getAnalyticsInstance('dekoratoren')

    const logEvent = useCallback(
        <T extends object>(eventName: string, eventData: T = {} as T) => {
            track(eventName, eventData).catch((error) => console.error(error))
        },
        [track]
    )

    return { logEvent }
}
