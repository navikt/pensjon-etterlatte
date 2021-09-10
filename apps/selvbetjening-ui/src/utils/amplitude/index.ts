import amplitude from "amplitude-js";
import { useEffect, useState } from "react";

export enum LogEvents {
    AAPNE_SOKNAD = "skjema startet",
}

export const logEvent = (eventName: LogEvents, eventData?: any): void => {
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

export const useAmplitude = () => {
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (!initialized) {
            console.log("Initializing amplitude");
            amplitude?.getInstance().init("default", "", {
                apiEndpoint: "amplitude.nav.no/collect-auto",
                saveEvents: false,
                includeUtm: true,
                includeReferrer: true,
                platform: window.location.toString(),
            });
            setInitialized(true);
        }
    });
};
