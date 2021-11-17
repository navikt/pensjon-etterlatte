import { useEffect, useState } from "react";
//import i18next from "i18next";
import i18next from "../i18n";
import { hentLocales } from "../api/api";

export enum Language {
    NORSK_BOKMAAL = "nb",
    NORSK_NYNORSK = "nn",
    ENGELSK = "en",
}


export const useLanguage = () => {
    const [locales, setLocales] = useState({en: {}, nn: {}, nb: {}});
    const [currentLanguage, setCurrentLanguage] = useState<Language>(Language.NORSK_BOKMAAL);

    useEffect(() => {   
        (async () => {
            const localeList = await hentLocales();
            setLocales(localeList);
        })()
    }, [])

    /** 
     * Init i18 next og sett valgt språk
     * **/
    useEffect(() => {
        if(!locales) return;

        i18next.addResourceBundle("nb", "translation", locales.nb);
        i18next.addResourceBundle("nn", "translation", locales.nn);
        i18next.addResourceBundle("en", "translation", locales.en);

        const preferredLang = window.localStorage.getItem("preferredLang") as Language;
        setCurrentLanguage(preferredLang || Language.NORSK_BOKMAAL);
    }, [locales]);

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
