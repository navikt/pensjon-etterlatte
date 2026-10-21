import { getAnalyticsInstance } from '@navikt/nav-dekoratoren-moduler'
import { useCallback, useEffect, useRef } from 'react'
import { useLocation } from 'react-router'

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

export const useAnalytics = () => {
    const { pathname } = useLocation()
    const forrigePathname = useRef(pathname)

    const track = getAnalyticsInstance('dekoratoren')

    const logEvent = useCallback(
        <T extends Record<string, unknown>>(eventName: string, eventData: T = {} as T) => {
            track.custom(eventName, eventData).catch((error) => console.error(error))
        },
        [track]
    )

    useEffect(() => {
        if (forrigePathname.current !== pathname) {
            logEvent(LogEvents.SIDEVISNING, {
                prevLocation: forrigePathname.current,
                newLocation: pathname,
            })
        }
        forrigePathname.current = pathname
    }, [pathname])

    return { logEvent }
}
