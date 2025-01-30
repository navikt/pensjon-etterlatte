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
    if (window.location.href.includes('dev.nav.no')) return 'b0ea5ed50acc6bdf505e3f6cdf76b99d' // dev
    if (window.location.href.includes('nav.no')) return '10798841ebeba333b8ece6c046322d76' // prod
    return '119ddb1e1aa52564d90038ac65926a7d' // other e.g. localhost
}

export const useAmplitude = () => {
    const location = useLocation()
    // biome-ignore lint/suspicious/noExplicitAny: gammel kode, venter med å fikse
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
    // biome-ignore lint/suspicious/noExplicitAny: gammel kode, venter med å fikse
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
