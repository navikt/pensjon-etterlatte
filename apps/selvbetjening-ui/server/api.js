const proxy = require("express-http-proxy");
const config = require("./config");
const TokenXClient = require("./auth/tokenx");
const logger = require("./logger");

const tokenx = new TokenXClient();

const options = () => ({
    parseReqBody: false,
    proxyReqOptDecorator: (options, req) => {
        return new Promise((resolve, reject) => {
            return tokenx.exchangeToken(req.session.tokens.access_token).then(
                (accessToken) => {
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
});

// TODO: Setup mock api routes
const setup = (app) => {
    // Proxy Selvbetjening API
    app.use(`${config.app.basePath}/api`, proxy(config.app.apiUrl, options()));
};

module.exports = {
    setup,
};
