import * as amplitude from '@amplitude/analytics-browser'
import { useLocation, Location } from 'react-router-dom'
import { useEffect, useState } from 'react'

export enum LogEvents {
    ALDER = 'alder',
    PAGE_CHANGE = 'sidevisning',
}

// Felles taksonomi for analytics https://github.com/navikt/analytics-taxonomy
export const useAmplitude = () => {
    const location = useLocation()
    const [prevLocation, setPrevLocation] = useState<Location>()

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

    useEffect(() => {
        if (prevLocation?.pathname !== location?.pathname) {
            logEvent(LogEvents.PAGE_CHANGE, {
                prevLocation: prevLocation?.pathname,
                newLocation: location?.pathname,
            })
        }
        setPrevLocation(location)
    }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

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
