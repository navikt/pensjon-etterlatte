const config = require("./config");
const auth = require("./auth");
const logger = require("./logger");
const proxy = require("express-http-proxy");

const options = () => ({
    parseReqBody: false,
    proxyReqOptDecorator: (options, req) => {
        return new Promise((resolve, reject) => {
            return auth.exchangeToken(req.session.tokens.access_token).then(
                (accessToken) => {
                    logger.info(`accessToken: ${accessToken}`);
                    options.headers.Authorization = `Bearer ${accessToken}`;
                    resolve(options);
                },
                (error) => reject(error)
            );
        });
    },
});

const setup = (app) => {
    auth.setup(config.idporten, config.tokenx, config.app).catch((err) => {
        logger.error(`Error while setting up auth: ${err}`);
        process.exit(1);
    });

    // Proxy Selvbetjening API
    app.use(`${config.basePath}/api`, proxy(config.apiUrl, options()));
};

module.exports = {
    setup,
};
