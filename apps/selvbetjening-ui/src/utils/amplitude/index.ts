import amplitude from "amplitude-js";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Gruppe } from "../ObjectTreeReader";

export enum LogEvents {
    AAPNE_SOKNAD = "skjema startet",
    SEND_SOKNAD = "send soknad",
    SIDEVISNING = "sidevisning",
    KLIKK = "klikk",
}

export const useAmplitude = () => {
    const location = useLocation();
    const [prevLocation, setPrevLocation] = useState<any>(location);

    useEffect(() => {
        amplitude?.getInstance().init("default", "", {
            apiEndpoint: "amplitude.nav.no/collect-auto",
            saveEvents: false,
            includeUtm: true,
            includeReferrer: true,
            platform: window.location.toString(),
        });
    }, []);

    useEffect(() => {
        if (prevLocation?.pathname !== location?.pathname) {
            logEvent(LogEvents.SIDEVISNING);
        }
        setPrevLocation(location);
    }, [location]);

    const getByKey = (object: any, key: string): any => {
        if (object.hasOwnProperty("key") && object["key"] === key) {
            return object;
        }
        for (let i = 0; i < Object.keys(object).length; i++) {
            if (typeof object[Object.keys(object)[i]] == "object") {
                const o = getByKey(object[Object.keys(object)[i]], key);
                if (o != null) return o;
            }
        }

        return null;
    };

    /*
     ** Funksjon for logging av enkeltsvar
     ** NB! Ikke logg svar ukritisk.
     */
    const logData = (oppsummering: Gruppe[]) => {
        const omDegOgAvdoed = getByKey(oppsummering, "omDegOgAvdoed.forholdTilAvdoede.relasjon").svar;
        logEvent(LogEvents.SEND_SOKNAD, {
            svar: {
                relasjonTilAvdoed: omDegOgAvdoed
            }
        });
    };

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
    return { logEvent, logData };
};
