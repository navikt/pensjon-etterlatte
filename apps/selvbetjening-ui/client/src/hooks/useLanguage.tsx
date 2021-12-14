import { useEffect, useState } from "react";
import i18next from "../i18n";
import { hentLocales } from "../api/api";

export enum Language {
    NORSK_BOKMAAL = "nb",
    NORSK_NYNORSK = "nn",
    ENGELSK = "en",
}

export const useLanguage = () => {
    const [locales, setLocales] = useState({ en: {}, nn: {}, nb: {} });
    const [currentLanguage, setCurrentLanguage] = useState<Language>(
        (window.localStorage.getItem("preferredLang") as Language) || Language.NORSK_BOKMAAL
    );

    useEffect(() => {
        (async () => {
            const localeList = await hentLocales(currentLanguage);
            setLocales({
                ...locales,
                [currentLanguage]: localeList,
            });
        })();
    }, [currentLanguage]);

    useEffect(() => {
        i18next.addResourceBundle(currentLanguage, "translation", locales[currentLanguage]);
        i18next.changeLanguage(currentLanguage, (err, t) => {
            if (err) return console.log("something went wrong loading", err);
            t("key");
        });
        window.localStorage.setItem("preferredLang", currentLanguage);
    }, [locales]);

    return {
        setLanguage: setCurrentLanguage,
        currentLanguage,
    };
};
