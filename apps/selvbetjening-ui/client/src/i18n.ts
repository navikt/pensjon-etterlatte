import i18n, { Resource } from "i18next";
import { initReactI18next } from "react-i18next";
import nnLocale from "./locales/nn.json";
import enLocale from "./locales/en.json";
import nbLocale from "./locales/nb.json";

export enum Language {
    NORSK_BOKMAAL = "nb",
    NORSK_NYNORSK = "nn",
    ENGELSK = "en",
}

const resources: Resource = {
    [Language.NORSK_BOKMAAL]: {
        translation: nbLocale
    },
    [Language.NORSK_NYNORSK]: {
        translation: nnLocale
    },
    [Language.ENGELSK]: {
        translation: enLocale
    }
};

i18n.use(initReactI18next).init({
    lng: "nb",
    nsSeparator: false,
    interpolation: {
        escapeValue: false,
    },
    react: {
        useSuspense: false,
    },
    resources
});

export default i18n;
