import amplitude from "amplitude-js";
import { useEffect } from "react";

export enum LogEvents {
    AAPNE_SOKNAD = "skjema startet",
    SEND_SOKNAD = "send soknad",
}

export const useAmplitude = () => {
    useEffect(() => {
        amplitude?.getInstance().init("default", "", {
            apiEndpoint: "amplitude.nav.no/collect-auto",
            saveEvents: false,
            includeUtm: true,
            includeReferrer: true,
            platform: window.location.toString(),
        });
    }, []);

    const logEvent = (eventName: LogEvents, eventData?: any): void => {
        setTimeout(() => {
            try {
                if (amplitude) {
                    amplitude.getInstance().logEvent(eventName, eventData);
                }
            } catch (error) {
                console.error(error);
            }
        }, 0);
    };
    return { logEvent };
};
