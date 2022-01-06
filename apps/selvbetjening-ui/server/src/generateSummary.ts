import i18next from "i18next";
import SoeknadMapper from "./utils/SoeknadMapper";
import nbLocale from './locales/nb.json';
import nnLocale from './locales/nn.json';
import enLocale from './locales/en.json';


i18next.init({
    lng: "nb",
    debug: true,
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
});

export const generateSummary = async (soeknad: any, bruker: any, locale?: any) =>
    await i18next.changeLanguage(locale).then((t) => {
        const mapper = new SoeknadMapper(t);
        return mapper.lagOppsummering(soeknad, bruker);
    });

