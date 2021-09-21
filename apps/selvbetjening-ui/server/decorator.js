const { injectDecoratorServerSide } = require("@navikt/nav-dekoratoren-moduler/ssr");
const config = require("./config");

// TODO: Ta i bruk <EnforceLoginLoader />
// https://github.com/navikt/nav-dekoratoren-moduler#-enforceloginloader--

const { isLabsCluster, isProdCluster } = config.env;

const env = isProdCluster ? "prod" : "dev";

const authProps = {
    enforceLogin: !isLabsCluster,
    redirectToApp: true,
    level: "Level4",
    logoutUrl: "/logout"
};

const props = {
    ...authProps,
    env,
    context: "privatperson",
    simple: true
};

const inject = (res, filePath) => {
    injectDecoratorServerSide({...props, filePath})
            .then((html) => {
                res.send(html);
            })
            .catch((e) => {
                console.error(e);
                res.status(500).send(e);
            });
};

const setup = (app, filePath) => {
    // Match everything except internal and static
    // Ikke bruke dekoratøren i labs-gcp
    app.use(/^(?!.*\/(internal|static)\/).*$/, (req, res) => {
        if (isLabsCluster) res.send(filePath);
        else inject(res, filePath);
    });
};

module.exports = {
    setup
};
