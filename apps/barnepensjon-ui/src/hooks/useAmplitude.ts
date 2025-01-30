import { getAmplitudeInstance } from "@navikt/nav-dekoratoren-moduler";
import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export enum EventType {
    WHY_WE_ASK = "hvorfor spør vi",
    CANCEL_APPLICATION = "avbryt soknad",
}

// Felles taksonomi for analytics https://github.com/navikt/analytics-taxonomy
export enum LogEvents {
    START_APPLICATION = "skjema startet",
    SELECT_SCENARIO = "scenario valgt",
    SELECT_SITUATION = "situasjon valgt",
    SEND_APPLICATION = "send soknad",
    SEND_APPLICATION_ERROR = "send soknad feilet",
    PAGE_CHANGE = "sidevisning",
    CHANGE_LANGUAGE = "endre sprak",
    SYSTEM_UNAVAILABLE = "system utilgjengelig",
    PAGE_NOT_FOUND = "side ikke funnet",
    CLICK = "klikk",
    QUESTION_ANSWERED = "skjema spørsmål besvart",
    VALIDATION_ERROR = "skjema validering feilet",
}

export const useAmplitude = () => {
    const location = useLocation();
    const [prevLocation, setPrevLocation] = useState(location);

    const track = getAmplitudeInstance("dekoratoren");

    useEffect(() => {
        if (prevLocation?.pathname !== location?.pathname) {
            logEvent(LogEvents.PAGE_CHANGE, {
                prevLocation: prevLocation?.pathname,
                newLocation: location?.pathname,
            });
        }
        setPrevLocation(location);
    }, [location]);

    const logEvent = useCallback(
        <T extends object>(eventName: string, eventData: T = {} as T) => {
            track(eventName, eventData).catch((error) => console.error(error));
        },
        [track],
    );

    return { logEvent };
};
