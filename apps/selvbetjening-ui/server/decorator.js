const { injectDecoratorServerSide } = require("@navikt/nav-dekoratoren-moduler/ssr");

const environment = process.env.NODE_ENV;

const props = {
    env: environment ?? "dev",
    context: "privatperson",
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
