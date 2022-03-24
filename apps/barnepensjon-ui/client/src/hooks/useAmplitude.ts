import amplitude from 'amplitude-js'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export enum EventType {
    WHY_WE_ASK = 'hvorfor spør vi',
    CANCEL_APPLICATION = 'avbryt soknad',
}

export enum LogEvents {
    START_APPLICATION = 'skjema startet',
    SELECT_SCENARIO = 'scenario valgt',
    SELECT_SITUATION = 'situasjon valgt',
    SEND_APPLICATION = 'send soknad',
    SEND_APPLICATION_ERROR = 'send soknad feilet',
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
        // @ts-ignore
    }, [])

    useEffect(() => {
        if (prevLocation?.pathname !== location?.pathname) {
            logEvent(LogEvents.PAGE_CHANGE)
        }
        setPrevLocation(location)
    }, [location])

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
