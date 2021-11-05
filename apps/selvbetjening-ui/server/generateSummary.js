const i18next = require("i18next/dist/cjs/i18next");
const { SoeknadMapper } = require("./utils/SoeknadMapper");
const nbLocale = require("./locales/nb.json");
const nnLocale = require("./locales/nn.json");
const enLocale = require("./locales/en.json");

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

const generateSummary = async (soeknad, bruker, locale) =>
    await i18next.changeLanguage(locale).then((t) => {
        const mapper = new SoeknadMapper(t, i18next);
        return mapper.lagOppsummering(soeknad, bruker);
    });

module.exports = {
    generateSummary,
};
