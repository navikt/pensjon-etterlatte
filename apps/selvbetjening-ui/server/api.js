const proxy = require("express-http-proxy");
const config = require("./config");
const TokenXClient = require("./auth/tokenx");
const logger = require("./logger");
const { mockApi } = require("./mock/mock-api");
const { sendSoeknad } = require("./router");

const { exchangeToken } = new TokenXClient();
const options = () => ({
    parseReqBody: false,
    proxyReqOptDecorator: (options, req) => {
        return new Promise((resolve, reject) => {
            return exchangeToken(req.session.tokens.access_token).then(
                (accessToken) => {
                    options.headers.ImageTag = process.env.NAIS_APP_IMAGE?.replace(/^.*selvbetjening-ui:(.*)/, "$1")
                    options.headers.Authorization = `Bearer ${accessToken}`;
                    resolve(options);
                },
                (error) => {
                    logger.error("Feil oppsto ved endring av request headers", error);
                    reject(error);
                }
            );
        });
    },
    proxyReqPathResolver: (req) => req.originalUrl.replace(`${config.app.basePath}/api`, '')
});


const setup = (app) => {
    // Intercept send søknad og lag oppsummering. Send så videre søknad og oppsummering
    app.use(sendSoeknad());
    // Proxy Selvbetjening API
    app.use(`${config.app.basePath}/api`, proxy(config.app.apiUrl, options()));
};

const mock = (app) => mockApi(app);

module.exports = {
    setup,
    mock,
};
