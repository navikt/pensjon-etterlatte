import * as amplitude from '@amplitude/analytics-browser'
import { useEffect } from 'react'

// Felles taksonomi for analytics https://github.com/navikt/analytics-taxonomy
export enum LogEvents {
    ALDER = 'alder',
    INGEN_OMS_SAK = 'ingen oms sak',
}

export const useAmplitude = () => {
    useEffect(() => {
        amplitude.init('default', '', {
            serverUrl: 'https://amplitude.nav.no/collect-auto',
            ingestionMetadata: {
                sourceName: window.location.toString(),
            },
            autocapture: {
                attribution: false,
                pageViews: true,
                sessions: true,
                formInteractions: false,
                fileDownloads: false,
            },
        })
    }, [])

    const logEvent = (eventName: LogEvents, eventData: object): void => {
        setTimeout(() => {
            try {
                if (amplitude) {
                    amplitude.logEvent(eventName, eventData)
                }
            } catch (error) {
                console.error(error)
            }
        }, 0)
    }

    return { logEvent }
}
