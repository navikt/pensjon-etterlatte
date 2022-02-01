import { useEffect } from "react";
import i18next from "../i18n";
import { useSoknadContext } from "../context/soknad/SoknadContext";

export const useLanguage = () => {
    const { state: soeknadState } = useSoknadContext();

    useEffect(() => {
        i18next.changeLanguage(soeknadState.spraak, (err, t) => {
            if (err) return console.log("something went wrong loading", err);
            t("key");
        });
    }, [soeknadState.spraak]);
};
