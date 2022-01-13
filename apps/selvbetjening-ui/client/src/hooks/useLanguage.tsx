import { useEffect, useState } from "react";
import i18next from "../i18n";
import nnLocale from "../locales/nn.json";
import enLocale from "../locales/en.json";
import nbLocale from "../locales/nb.json";

export enum Language {
    NORSK_BOKMAAL = "nb",
    NORSK_NYNORSK = "nn",
    ENGELSK = "en",
}

const getLocaleJson = (locale: Language) => {
    switch(locale) {
        case "nn":
            return nnLocale;
        case "en":
            return enLocale;
        default:
            return nbLocale;
    }
}

export const useLanguage = () => {
    const [locales, setLocales] = useState({ en: {}, nn: {}, nb: {} });
    const [currentLanguage, setCurrentLanguage] = useState<Language>(
        (window.localStorage.getItem("preferredLang") as Language) || Language.NORSK_BOKMAAL
    );

    useEffect(() => {
        (async () => {
            setLocales({
                ...locales,
                [currentLanguage]: getLocaleJson(currentLanguage),
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
