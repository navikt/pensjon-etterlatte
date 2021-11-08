const client = require('prom-client')
const config = require("./config");
const logger = require("./logger");

const basePath = config.app.basePath;

const collectDefaultMetrics = client.collectDefaultMetrics;
const register = new client.Registry();

collectDefaultMetrics({ register });

const setup = (app) => {
    logger.info("Setup metrics");

    app.get(`${basePath}/metrics`, async (req, res) => {
        res.set('Content-Type', register.contentType);
        res.end(await register.metrics())
    });
};

module.exports = {
    setup
};
