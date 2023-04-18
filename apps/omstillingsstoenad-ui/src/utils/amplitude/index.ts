import amplitude from 'amplitude-js'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export enum LogEvents {
    AAPNE_SOKNAD = 'skjema startet',
    SEND_SOKNAD = 'send soknad',
    SIDEVISNING = 'sidevisning',
    KLIKK = 'klikk',
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
            logEvent(LogEvents.SIDEVISNING)
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
