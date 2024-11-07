import * as amplitude from '@amplitude/analytics-browser'
import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export enum EventType {
    WHY_WE_ASK = 'hvorfor spør vi',
    CANCEL_APPLICATION = 'avbryt soknad',
}

// Felles taksonomi for analytics https://github.com/navikt/analytics-taxonomy
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
    QUESTION_ANSWERED = 'skjema spørsmål besvart',
    VALIDATION_ERROR = 'skjema validering feilet',
}

export const useAmplitude = () => {
    const location = useLocation()
    const [prevLocation, setPrevLocation] = useState<any>(location)

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
            logEvent(LogEvents.PAGE_CHANGE)
        }
        setPrevLocation(location)
    }, [location]) // eslint-disable-line react-hooks/exhaustive-deps

    const logEvent = (eventName: LogEvents, eventData?: any): void => {
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
