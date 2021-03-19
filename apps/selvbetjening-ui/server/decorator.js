const { injectDecoratorServerSide } = require("@navikt/nav-dekoratoren-moduler/ssr");

const environment = process.env.NODE_ENV;

const loginServiceProps =
    environment !== "localhost"
        ? {
              enforceLogin: true,
              redirectToApp: true,
              level: "Level4",
          }
        : undefined;

const props = {
    ...loginServiceProps,
    env: environment,
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
