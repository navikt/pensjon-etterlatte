import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import nbLocale from "./assets/locales/nb.json";
import nnLocale from "./assets/locales/nn.json";
import enLocale from "./assets/locales/en.json";

i18n.use(initReactI18next).init({
    resources: {
        nb: {
            translation: nbLocale,
        },
        nn: {
            translation: nnLocale,
        },
        en: {
            translation: enLocale,
        },
    },
    lng: "nb",
    // keySeparator: false,
    nsSeparator: false,
    interpolation: {
        escapeValue: false,
    },
    react: {
        useSuspense: false,
    },
});

export default i18n;
