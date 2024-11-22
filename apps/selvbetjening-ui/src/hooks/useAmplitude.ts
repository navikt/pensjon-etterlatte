import * as amplitude from '@amplitude/analytics-browser'
import { useEffect } from 'react'

// Felles taksonomi for analytics https://github.com/navikt/analytics-taxonomy
export enum LogEvents {
    ALDER = 'alder',
    INGEN_OMS_SAK = 'ingen oms sak',
}

const getAmplitudeKey = () => {
    if (window.location.href.includes('dev.nav.no')) return 'c2b699e504e5a989f1bcb638bf07cf78' // dev
    if (window.location.href.includes('nav.no')) return '10798841ebeba333b8ece6c046322d76' // prod
    return '' // other e.g. localhost
}

export const useAmplitude = () => {
    useEffect(() => {
        amplitude.init(getAmplitudeKey(), '', {
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
