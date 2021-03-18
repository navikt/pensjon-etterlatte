const { injectDecoratorServerSide } = require("@navikt/nav-dekoratoren-moduler/ssr");

const props = {
    env: "dev",
    context: "privatperson",
    enforceLogin: true,
    redirectToApp: true,
    level: "Level4",
    breadcrumbs: [
        {
            url: "https://www.nav.no/person/familie/soknad",
            title: "Søknad om etterlatteytelser",
            handleInApp: true,
        },
    ],
};

const getDecorator = (filePath) => injectDecoratorServerSide({ ...props, filePath });

module.exports = getDecorator;
