const { injectDecoratorServerSide } = require("@navikt/nav-dekoratoren-moduler/ssr");

const getDecorator = (filePath) =>
    injectDecoratorServerSide({
        env: "dev",
        filePath: filePath,
        enforceLogin: true,
        level: "Level4",
        breadcrumbs: [
            {
                url: "https://www.nav.no/person/familie/soknad",
                title: "Søknad om etterlatteytelser",
                handleInApp: true,
            },
        ],
    });

module.exports = getDecorator;
