const express = require("express");
const proxy = require("express-http-proxy");
const path = require("path");
const getDecorator = require("./decorator");
const logger = require("./logger");
const config = require("./config");
const auth = require("./auth");
const { setupSession } = require("./session");
const { generators, TokenSet } = require("openid-client");

const app = express();

let authEndpoint = null;
auth.setup(config.idporten, config.tokenx, config.app)
    .then((endpoint) => {
        authEndpoint = endpoint;
    })
    .catch((err) => {
        logger.error(`Error while setting up auth: ${err}`);
        process.exit(1);
    });

const buildPath = path.resolve(__dirname, "../build");

const basePath = config.basePath;

app.use(setupSession());
app.use(basePath, express.static(buildPath, { index: false }));

// Selvbetjening API
const apiUrl = process.env.API_URL || "localhost:8085";
app.use(`${basePath}/api`, proxy(apiUrl));

app.get(`${basePath}/login`, async (req, res) => {
    // lgtm [js/missing-rate-limiting]
    const session = req.session;
    session.nonce = generators.nonce();
    session.state = generators.state();
    res.redirect(auth.authUrl(session));
});

app.get(`${basePath}/oauth2/callback`, async (req, res) => {
    const session = req.session;

    auth.validateOidcCallback(req)
        .then((tokens) => {
            logger.info("Preparing cookie");
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
            logger.error(err);
            session.destroy();
            res.sendStatus(403);
        });
});

// check auth
app.use(async (req, res, next) => {
    logger.info("Checking auth");
    const session = req.session;

    const currentTokens = session.tokens;

    if (!currentTokens) {
        logger.info("No current tokens");
        res.redirect(`${basePath}/login`);
    } else {
        logger.info("Found current tokens");
        const currentTokenSet = new TokenSet(currentTokens);
        if (currentTokenSet.expired()) {
            logger.info("refreshing token");
            auth.refresh(currentTokens)
                .then((refreshedTokenSet) => {
                    session.tokens = new TokenSet(refreshedTokenSet);
                })
                .catch((err) => {
                    logger.error(err);
                    session.destroy();
                    res.redirect(`${basePath}/login`);
                });
        }
        return next();
    }
});

const getSecure = async (bearerToken) => {
    const apiUrl = process.env.API_URL;

    return fetch(`${apiUrl}/secure`, {
        method: "get",
        headers: { Authorization: `Bearer ${bearerToken}` },
    }).then((res) => res.text());
};

app.get(`${basePath}/secure`, async (req, res) => {
    try {
        const accessToken = await auth.exchangeToken(req.session.tokens.access_token);
        const response = await getSecure(accessToken);
        res.send(response);
    } catch (err) {
        logger.error(`Error while calling api: ${err}`);
        res.sendStatus(500);
    }
});

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
