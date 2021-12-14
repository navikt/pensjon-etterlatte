
import proxy from 'express-http-proxy';
import config from './config';
import TokenXClient from './auth/tokenx';
import logger from './log/logger';
import { mockApi } from './mock/mock-api';
import { sendSoeknad } from './router';


const { exchangeToken } = new TokenXClient();
const options: any = () => ({
    parseReqBody: false,
    proxyReqOptDecorator: (options: any, req: any) => {
        logger.info(`${req.protocol?.toUpperCase()} ${req.method} ${req.path}`);

        return new Promise((resolve, reject) => {
            return exchangeToken(req.session.tokens.access_token).then(
                (accessToken) => {
                    options.headers.Authorization = `Bearer ${accessToken}`;
                    resolve(options);
                },
                (error) => {
                    logger.error("Error occured while changing request headers: ", error);
                    reject(error);
                }
            );
        });
    },
    proxyReqPathResolver: (req: any) => req.originalUrl.replace(`${config.app.basePath}/api`, ''),
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
