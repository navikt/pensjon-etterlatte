const express = require("express");
const path = require("path");
const getDecorator = require("./decorator");
const logger = require("./logger");
const proxy = require("./proxy");
const config = require("./config");
const auth = require("./auth");
const { appSession } = require("./session");
const { generators, TokenSet } = require("openid-client");

const buildPath = path.resolve(__dirname, "../build");
const basePath = config.basePath;
const app = express();

app.set("trust proxy", 1);
app.use(appSession);
app.use(basePath, express.static(buildPath, { index: false }));

app.get(`${basePath}/login`, async (req, res) => {
    const session = req.session;
    session.nonce = generators.nonce();
    session.state = generators.state();
    res.redirect(auth.authUrl(session));
});

app.get(`${basePath}/logout/callback`, async (req, res) => {
    console.log("Loginservice slo");
    res.redirect(process.env.LOGINSERVICE_LOGOUT_URL)
});

app.get(`${basePath}/logout`, async (req, res) => {
    console.log("Initiating logout");

    const idToken = new TokenSet(req.session.tokens).id_token
    console.log("idToken: ", idToken)

    appSession.destroySessionBySid(req.sessionID);
    req.session.destroy();

    res.cookie("selvbetjening-idtoken", "", {
        expires: new Date(0),
    });

    if (!!idToken) {
        console.log("Attempting to end session with idToken: ", idToken)
        const endSessionUrl = auth.endSessionUrl(idToken);

        res.redirect(endSessionUrl);
    } else {
        console.error("Error during logout")
        res.redirect(config.idporten.postLogoutRedirectUri)
    }
});

app.get(`${basePath}/oauth2/callback`, async (req, res) => {
    const session = req.session;

    auth.validateOidcCallback(req)
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
            auth.refresh(currentTokens)
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

proxy.setup(app);

// Match everything except internal and static
app.use(/^(?!.*\/(internal|static)\/).*$/, (req, res) =>
    getDecorator(`${buildPath}/index.html`)
        .then((html) => {
            res.send(html);
        })
        .catch((e) => {
            console.error(e);
            res.status(500).send(e);
        })
);

// Endpoints to verify is app is ready/alive
app.get(`/isAlive|isReady`, (req, res) => {
    res.sendStatus(200);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});
