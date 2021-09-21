const { injectDecoratorServerSide } = require("@navikt/nav-dekoratoren-moduler/ssr");
const config = require("./config");

// TODO: Ta i bruk <EnforceLoginLoader />
// https://github.com/navikt/nav-dekoratoren-moduler#-enforceloginloader--

const env = (config.env.isProduction || config.env.isLabs) ? "prod" : "dev";

const authProps = {
    enforceLogin: !config.env.isLabs,
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

const getDecorator = (filePath) => injectDecoratorServerSide({ ...props, filePath });

const setup = (app, buildPath) => {
    // Match everything except internal and static
    app.use(/^(?!.*\/(internal|static)\/).*$/, (req, res) =>
            getDecorator(`${buildPath}/index.html`)
                    .then((html) => {
                        res.send(html);
                    })
                    .catch((e) => {
                        console.error(e);
                        res.status(500).send(e);
                    })
    );
};

module.exports = {
    setup
};
