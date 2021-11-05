const i18next = require("i18next");
const { SoeknadMapper } = require("./utils/SoeknadMapper");
const nbLocale = require("./locales/nb.json");
const nnLocale = require("./locales/nn.json");
const enLocale = require("./locales/en.json");

const i18n = i18next.default;

i18n.init({
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
    await i18n.changeLanguage(locale).then((t) => {
        const mapper = new SoeknadMapper(t, i18n);
        return mapper.lagOppsummering(soeknad, bruker);
    });

module.exports = {
    generateSummary,
};
