import amplitude from "amplitude-js";

export enum LogEvents {
    AAPNE_SOKNAD = "etterlatte.aapneSoknad",
}

export const initAmplitude = () => {
    if (amplitude) {
        amplitude.getInstance().init("default", "", {
            apiEndpoint: "amplitude.nav.no/collect-auto",
            saveEvents: false,
            includeUtm: true,
            includeReferrer: true,
            platform: window.location.toString(),
        });
    }
};

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
