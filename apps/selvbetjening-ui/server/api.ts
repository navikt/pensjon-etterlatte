
import proxy from 'express-http-proxy';
import config from './config';
import TokenXClient from './auth/tokenx';
import logger from './logger';
import { mockApi } from './mock/mock-api';
import { sendSoeknad } from './router';


const { exchangeToken } = new TokenXClient();
const options: any = () => ({
    parseReqBody: false,
    proxyReqOptDecorator: (options: any, req: any) => {
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
    proxyReqPathResolver: (req: any) => req.originalUrl.replace(`${config.app.basePath}/api`, '')
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
