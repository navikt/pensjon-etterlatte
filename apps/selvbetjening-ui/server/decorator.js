const { injectDecoratorServerSide } = require("@navikt/nav-dekoratoren-moduler/ssr");

// TODO: Ta i bruk <EnforceLoginLoader />
// https://github.com/navikt/nav-dekoratoren-moduler#-enforceloginloader--

const env = process.env.NAIS_CLUSTER_NAME === "prod-gcp" ? "prod" : "dev";

const authProps = {
    enforceLogin: true,
    redirectToApp: true,
    level: "Level4",
};

const props = {
    ...authProps,
    env,
    context: "privatperson",
    simple: true
};

const getDecorator = (filePath) => injectDecoratorServerSide({ ...props, filePath });

module.exports = getDecorator;
