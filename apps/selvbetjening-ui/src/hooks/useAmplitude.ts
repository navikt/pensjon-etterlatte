import amplitude from 'amplitude-js'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export enum EventType {
}

export enum LogEvents {
    PAGE_CHANGE = 'sidevisning',
    CHANGE_LANGUAGE = 'endre sprak',
    SYSTEM_UNAVAILABLE = 'system utilgjengelig',
    PAGE_NOT_FOUND = 'side ikke funnet',
    CLICK = 'klikk',
}

export const useAmplitude = () => {
    const location = useLocation()
    const [prevLocation, setPrevLocation] = useState<any>(location)

    useEffect(() => {
        amplitude?.getInstance().init('default', '', {
            apiEndpoint: 'amplitude.nav.no/collect-auto',
            saveEvents: false,
            includeUtm: true,
            includeReferrer: true,
            platform: window.location.toString(),
        })
    }, [])

    useEffect(() => {
        if (prevLocation?.pathname !== location?.pathname) {
            logEvent(LogEvents.PAGE_CHANGE)
        }
        setPrevLocation(location)
    }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

    const logEvent = (eventName: LogEvents, eventData?: any): void => {
        setTimeout(() => {
            try {
                if (amplitude) {
                    amplitude.getInstance().logEvent(eventName, eventData)
                }
            } catch (error) {
                console.error(error)
            }
        }, 0)
    }
    return { logEvent }
}
