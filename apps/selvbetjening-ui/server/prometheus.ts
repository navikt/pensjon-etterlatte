
import client from 'prom-client';
import config from './config';
import logger from "./logger";

const basePath = config.app.basePath;

const collectDefaultMetrics = client.collectDefaultMetrics;
const register = new client.Registry();

collectDefaultMetrics({ register });

const setup = (app: any) => {
    logger.info("Setup metrics");

    app.get(`${basePath}/metrics`, async (req: any, res: any) => {
        res.set('Content-Type', register.contentType);
        res.end(await register.metrics())
    });
};

export default {
    setup
}