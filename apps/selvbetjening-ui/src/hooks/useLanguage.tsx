import { useEffect, useState } from "react";
import i18next from "i18next";

export enum Language {
    NORSK_BOKMAAL = "nb",
    NORSK_NYNORSK = "nn",
    ENGELSK = "en",
}

export const useLanguage = () => {
    const [currentLanguage, setCurrentLanguage] = useState<Language>(Language.NORSK_BOKMAAL);

    /** Funksjonalitet for å detecte språk, må vi valideree at det er et godkjent språk?*/
    // Slått av inntil vi har språkene
    useEffect(() => {
        const preferredLang = window.localStorage.getItem("preferredLang") as Language;
        const lng = navigator.language.slice(0, 2) as Language;
        setCurrentLanguage(preferredLang || lng);
    }, []);

    useEffect(() => {
        i18next.changeLanguage(currentLanguage, (err, t) => {
            if (err) return console.log("something went wrong loading", err);
            t("key");
        });
        window.localStorage.setItem("preferredLang", currentLanguage);
    }, [currentLanguage]);

    return {
        setLanguage: setCurrentLanguage,
        currentLanguage,
    };
};
