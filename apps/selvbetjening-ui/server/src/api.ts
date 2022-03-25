import proxy from 'express-http-proxy';
import config from './config';
import TokenXClient from './auth/tokenx';
import logger from './monitoring/logger';
import { mockApi } from './mock/mock-api';
import { sendSoeknad } from './router';

const { exchangeToken } = new TokenXClient();
const options: any = () => ({
    parseReqBody: false,
    proxyReqOptDecorator: (options: any, req: any) => {
        logger.info(`${req.protocol?.toUpperCase()} ${req.method} ${req.path}`);

        const { authorization } = req.headers
        const token = authorization!!.split(' ')[1]

        return new Promise((resolve, reject) => {
            return exchangeToken(token).then(
                (accessToken) => {
                    options.headers.authorization = `Bearer ${accessToken}`;
                    resolve(options);
                },
                (error) => {
                    logger.error("Error occured while changing request headers: ", error);
                    reject(error);
                }
            );
        });
    },
    proxyReqPathResolver: (req: any) => {
        const kilde = process.env.NAIS_APP_NAME
        const newUrl = req.originalUrl.replace(new RegExp(`${config.app.basePath}/api(.*)`), `$1?kilde=${kilde}`)
        logger.info(`Origin: ${req.originalUrl}`)
        logger.info(`New: ${newUrl}`)
        return newUrl
    },
    proxyErrorHandler: (err: any, res: any, next: any) => {
        logger.error("Proxy error: ", err)
        next(err);
    }
});

const setup = (app: any) => {
    // Intercept send søknad og lag oppsummering. Send så videre søknad og oppsummering
    app.use(sendSoeknad());
    // Proxy Selvbetjening API
    app.use(`${config.app.basePath}/api`, proxy(config.app.apiUrl, options()));
};

const mock = (app: any) => mockApi(app);

export default {
    setup,
    mock,
};
