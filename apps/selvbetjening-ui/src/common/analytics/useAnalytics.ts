import { getAnalyticsInstance } from '@navikt/nav-dekoratoren-moduler'
import { useCallback } from 'react'

// Felles taksonomi for analytics https://github.com/navikt/analytics-taxonomy
export enum LogEvents {
    ALDER = 'alder',
    INGEN_OMS_SAK = 'ingen oms sak',
    KLIKK = 'klikk',
    ETTERSEND_DOKUMENTASJON_KLIKK = 'ettersend dokumentasjon klikk',
    MELD_INN_ENDRING_ENDRING_TYPE = 'meld inn endring endring type',
}

export enum EventType {
    LENKE_KLIKK = 'lenke klikk',
    INNSENDELSE = 'innsendelse',
}

export const useAnalytics = () => {
    const track = getAnalyticsInstance('dekoratoren')

    const logEvent = useCallback(
        <T extends Record<string, unknown>>(eventName: string, eventData: T = {} as T) => {
            track.custom(eventName, eventData).catch((error) => console.error(error))
        },
        [track]
    )

    return { logEvent }
}
