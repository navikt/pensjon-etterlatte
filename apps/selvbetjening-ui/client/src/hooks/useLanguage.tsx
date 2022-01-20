import { useEffect, useState } from "react";
import i18next, { Language } from "../i18n";

export const useLanguage = () => {
    const [currentLanguage, setCurrentLanguage] = useState<Language>(
        (window.localStorage.getItem("preferredLang") as Language) || Language.NORSK_BOKMAAL
    );

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
