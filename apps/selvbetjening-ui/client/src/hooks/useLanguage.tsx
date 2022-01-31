import { useEffect, useState } from "react";
import i18next, { Language } from "../i18n";
import { useSoknadContext } from "../context/soknad/SoknadContext";
import { ActionTypes } from "../context/soknad/soknad";

export const useLanguage = () => {
    const { dispatch: soknadDispatch } = useSoknadContext();
    const [currentLanguage, setCurrentLanguage] = useState<Language>(
        (window.localStorage.getItem("preferredLang") as Language) || Language.NORSK_BOKMAAL
    );

    useEffect(() => {
        if (["nb", "nn", "en"].includes(currentLanguage)) {
            i18next.changeLanguage(currentLanguage, (err, t) => {
                if (err) return console.log("something went wrong loading", err);
                t("key");
            });
            window.localStorage.setItem("preferredLang", currentLanguage);

            soknadDispatch({
                type: ActionTypes.OPPDATER_SPRAAK,
                payload: currentLanguage,
            });
        }
    }, [currentLanguage]);

    return {
        setLanguage: setCurrentLanguage,
        currentLanguage,
    };
};
