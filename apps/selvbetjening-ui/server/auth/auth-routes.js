const { appSession} = require("../session");
const { generators, TokenSet } = require("openid-client");
const IDportenClient = require("./idporten");
const config = require("../config");
const logger = require("../logger");

const basePath = config.app.basePath;

const idporten = new IDportenClient();

const setup = (app) => {
    app.use(appSession);

    app.get(`${basePath}/login`, async (req, res) => {
        const session = req.session;
        session.nonce = generators.nonce();
        session.state = generators.state();
        res.redirect(idporten.authUrl(session));
    });

    app.get(`${basePath}/logout/callback`, async (req, res) => {
        console.log("Loginservice slo");
        res.redirect(config.app.loginServiceLogoutUrl)
    });

    app.get(`${basePath}/logout`, async (req, res) => {
        const idToken = new TokenSet(req.session.tokens).id_token

        console.log("Initiating logout");

        console.log("Destroying session")
        appSession.destroySessionBySid(req.sessionID);
        req.session.destroy((err) => {
            if (err) console.error(err);
            else console.log("Session destroyed")
        });

        res.cookie("selvbetjening-idtoken", "", {
            expires: new Date(0),
        });

        if (!!idToken) {
            console.log("Ending idporten session")
            const endSessionUrl = idporten.endSessionUrl(idToken, config.idporten.postLogoutRedirectUri);

            res.redirect(endSessionUrl);
        } else {
            console.error("Error during logout")
            // TODO: Hvor skal vi redirecte brukeren dersom utlogging feiler?
            res.redirect(config.idporten.postLogoutRedirectUri)
        }
    });

    app.get(`${basePath}/oauth2/callback`, async (req, res) => {
        const session = req.session;

        idporten.validateOidcCallback(req)
                .then((tokens) => {
                    session.tokens = tokens;
                    session.state = null;
                    session.nonce = null;

                    res.cookie("selvbetjening-idtoken", `${tokens.id_token}`, {
                        secure: config.app.useSecureCookies,
                        sameSite: "lax",
                        domain: config.idporten.domain,
                        maxAge: config.session.maxAgeMs,
                    });
                    res.redirect(303, "/");
                })
                .catch((err) => {
                    logger.error("Feil oppsto under validateOidcCallback: ", err);
                    session.destroy();
                    res.sendStatus(403);
                });
    });

    // check auth
    app.use(async (req, res, next) => {
        const session = req.session;
        const currentTokens = session.tokens;

        if (!currentTokens) {
            res.redirect(`${basePath}/login`);
        } else {
            const currentTokenSet = new TokenSet(currentTokens);
            if (currentTokenSet.expired()) {
                idporten.refresh(currentTokens)
                        .then((refreshedTokenSet) => {
                            session.tokens = new TokenSet(refreshedTokenSet);
                        })
                        .catch((err) => {
                            logger.error("Feil oppsto ved refresh av token", err);
                            session.destroy();
                            res.redirect(`${basePath}/login`);
                        });
            }
            return next();
        }
    });
};

module.exports = {
    setup
}
