const { injectDecoratorServerSide } = require("@navikt/nav-dekoratoren-moduler/ssr");

const environment = process.env.NODE_ENV;

// TODO: Ta i bruk <EnforceLoginLoader />
// https://github.com/navikt/nav-dekoratoren-moduler#-enforceloginloader--

const authProps = {
    enforceLogin: true,
    redirectToApp: true,
    level: "Level4",
};

const props = {
    ...authProps,
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
