const i18next = require('i18next/dist/cjs/i18next')
const { SoeknadMapper } = require("./utils/SoeknadMapper");
const nbLocale = require("./locales/nb.json");
const nnLocale = require("./locales//nn.json");
const enLocale = require("./locales//en.json");

i18next.init({
    lng: 'nb',
    debug: true,
    resources: {
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
    }
  });

const generateSummary = (soeknad, bruker) => {
    const mapper = new SoeknadMapper(i18next.t, i18next);
    return mapper.lagOppsummering(soeknad, bruker);
};

module.exports = {
    generateSummary,
};
