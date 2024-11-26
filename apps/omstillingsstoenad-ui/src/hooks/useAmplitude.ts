import * as amplitude from '@amplitude/analytics-browser'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

// Felles taksonomi for analytics https://github.com/navikt/analytics-taxonomy
export enum LogEvents {
    AAPNE_SOKNAD = 'skjema startet',
    SEND_SOKNAD = 'send soknad',
    SIDEVISNING = 'sidevisning',
    KLIKK = 'klikk',
    VALIDATION_ERROR = 'skjema validering feilet',
    SPOERSMAAL_BESVART = 'skjema spørsmål besvart',
    ALERT_VIST = 'alert vist',
}

const getAmplitudeKey = () => {
    if (window.location.href.includes('dev.nav.no')) return 'c2b699e504e5a989f1bcb638bf07cf78' // dev
    if (window.location.href.includes('nav.no')) return '10798841ebeba333b8ece6c046322d76' // prod
    return '' // other e.g. localhost
}

export const useAmplitude = () => {
    const location = useLocation()
    const [prevLocation, setPrevLocation] = useState<any>(location)

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

    useEffect(() => {
        if (prevLocation?.pathname !== location?.pathname) {
            logEvent(LogEvents.SIDEVISNING, {
                prevLocation: prevLocation?.pathname,
                newLocation: location?.pathname,
            })
        }
        setPrevLocation(location)
    }, [location])

    const logEvent = (eventName: LogEvents, eventData: any): void => {
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
