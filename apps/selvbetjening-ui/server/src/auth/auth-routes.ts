import { appSession, destroySessionBySid } from '../session';
import { generators, TokenSet } from 'openid-client';
import IDportenClient from './idporten';
import config from '../config';
import logger from '../log/logger';
import jwt, { JwtPayload } from "jsonwebtoken";


const basePath = config.app.basePath;

const idporten = new IDportenClient();

const getSid = (token: any) => {
    if (!token) return
    return (jwt.decode(token) as JwtPayload)?.sid
}

const setup = (app: any) => {
    app.use(appSession);

    app.get(`${basePath}/login`, async (req: any, res: any) => {
        const session = req.session;
        session.nonce = generators.nonce();
        session.state = generators.state();
        res.redirect(idporten.authUrl(session));
    });

    app.get(`${basePath}/logout/callback`, async (req: any, res: any) => {
        logger.info(`Redirect to: ${config.app.loginServiceLogoutUrl}`);
        res.redirect(config.app.loginServiceLogoutUrl);
    });

    app.get(`${basePath}/logout`, async (req: any, res: any) => {
        const idToken = new TokenSet(req.session.tokens).id_token;

        logger.info("Initiating logout");

        destroySessionBySid(req.sessionID);
        req.session.destroy((err: any) => {
            if (err) logger.error(err);
            else logger.info("Session destroyed");
        });

        res.cookie("selvbetjening-idtoken", "", {
            expires: new Date(0),
        });

        if (!!idToken) {
            logger.info("Ending idporten session")
            const endSessionUrl = idporten.endSessionUrl(idToken, config.idporten.postLogoutRedirectUri);

            res.redirect(endSessionUrl);
        } else {
            logger.error("Error during logout");
            // TODO: Hvor skal vi redirecte brukeren dersom utlogging feiler?
            res.redirect(config.idporten.postLogoutRedirectUri);
        }
    });

    app.get(`${basePath}/oauth2/callback`, async (req: any, res: any) => {
        const session = req.session;

        idporten.validateOidcCallback(req)
                .then((tokens: TokenSet) => {
                    session.tokens = tokens;
                    session.state = null;
                    session.nonce = null;

                    if (config.env.isProduction) {
                        session.idportenSid = getSid(tokens.id_token)
                        res.redirect(301, config.app.loginServiceUrl || '/')
                    } else {
                        res.redirect(303, basePath);
                    }
                })
                .catch((err) => {
                    logger.error("Feil oppsto under validateOidcCallback: ", err);
                    session.destroy();
                    res.sendStatus(403);
                });
    });

    app.get(`${basePath}/oauth2/session`, async (req: any, res: any) => {
        const currentTokens = req.session.tokens;

        if (currentTokens) {
            const expiry = new TokenSet(currentTokens).expires_in;

            res.send(`${expiry}`);
        } else {
            res.sendStatus(401);
        }
    });

    // check auth
    app.use(async (req: any, res: any, next: any) => {
        const currentTokens = req.session.tokens;

        if (!currentTokens) {
            res.redirect(`${basePath}/login`);
        } else if (new TokenSet(currentTokens).expired()) {
            res.redirect(`${basePath}/logout`);
        } else {
            return next();
        }
    });
};

export default {
    setup
}
