const config = require("./config");
const auth = require("./auth");
const logger = require("./logger");
const proxy = require("express-http-proxy");

const basePath = config.basePath;

const options = () => ({
    parseReqBody: false,
    proxyReqOptDecorator: (options, req) => {
        return new Promise((resolve, reject) => {
            let onfulfilled = (response) => {
                options.headers.Authorization = `Bearer ${response.access_token}`;
                resolve(options);
            };
            let onrejected = (error) => reject(error);

            return auth.exchangeToken(req.session.tokens.access_token).then(onfulfilled, onrejected);
        });
    },
});

const setup = (app) => {
    auth.setup(config.idporten, config.tokenx, config.app).catch((err) => {
        logger.error(`Error while setting up auth: ${err}`);
        process.exit(1);
    });

    // Proxy Selvbetjening API
    app.use(`${basePath}/api`, proxy(config.apiUrl, options()));
};

module.exports = {
    setup,
};
