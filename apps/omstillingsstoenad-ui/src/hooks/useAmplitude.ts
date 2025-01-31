import { getAmplitudeInstance } from '@navikt/nav-dekoratoren-moduler'
import { useCallback, useEffect, useState } from 'react'
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

export const useAmplitude = () => {
    const location = useLocation()
    // biome-ignore lint/suspicious/noExplicitAny: gammel kode, venter med å fikse
    const [prevLocation, setPrevLocation] = useState<any>(location)

    const track = getAmplitudeInstance('dekoratoren')

    useEffect(() => {
        if (prevLocation?.pathname !== location?.pathname) {
            logEvent(LogEvents.SIDEVISNING, {
                prevLocation: prevLocation?.pathname,
                newLocation: location?.pathname,
            })
        }
        setPrevLocation(location)
    }, [location])
    const logEvent = useCallback(
        // biome-ignore lint/suspicious/noExplicitAny: gammel kode, venter med å fikse
        (eventName: LogEvents, eventData: any) => {
            // biome-ignore lint/suspicious/noExplicitAny: gammel kode, venter med å fikse
            track(eventName, eventData).catch((error: any) => console.error(error))
        },
        [track]
    )
    return { logEvent }
}
