import * as amplitude from "@amplitude/analytics-browser";
import { useEffect, useState } from "react";
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

const getAmplitudeKey = () => {
    if (window.location.href.includes("dev.nav.no")) return "b0ea5ed50acc6bdf505e3f6cdf76b99d"; // dev
    if (window.location.href.includes("nav.no")) return "10798841ebeba333b8ece6c046322d76"; // prod
    return "119ddb1e1aa52564d90038ac65926a7d"; // other e.g. localhost
};

export const useAmplitude = () => {
    const location = useLocation();
    const [prevLocation, setPrevLocation] = useState(location);

    useEffect(() => {
        amplitude.init(getAmplitudeKey(), "", {
            serverUrl: "https://amplitude.nav.no/collect-auto",
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
        });
    }, []);

    useEffect(() => {
        if (prevLocation?.pathname !== location?.pathname) {
            logEvent(LogEvents.PAGE_CHANGE, {
                prevLocation: prevLocation?.pathname,
                newLocation: location?.pathname,
            });
        }
        setPrevLocation(location);
    }, [location]);

    const logEvent = (eventName: LogEvents, eventData: Record<string, any> | undefined): void => {
        setTimeout(() => {
            try {
                if (amplitude) {
                    amplitude.logEvent(eventName, eventData);
                }
            } catch (error) {
                console.error(error);
            }
        }, 0);
    };
    return { logEvent };
};
