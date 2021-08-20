const { Issuer, TokenSet } = require("openid-client");
const jwt = require("jsonwebtoken");
const ULID = require("ulid");
const jose = require("node-jose");
const logger = require("./logger");

let tokenxConfig = null;
let tokenxClient = null;
let tokenxMetadata = null;
let idportenConfig = null;
let idportenClient = null;
let idportenMetadata = null;
let appConfig = null;

const setup = async (idpConfig, txConfig, appConf) => {
    logger.info("Setter opp autentisering og tilhørende konfig");
    idportenConfig = idpConfig;
    tokenxConfig = txConfig;
    appConfig = appConf;

    return init().then((clients) => {
        idportenClient = clients.idporten;
        tokenxClient = clients.tokenx;
    });
};

const authUrl = (session) => {
    return idportenClient.authorizationUrl({
        scope: idportenConfig.scope,
        redirect_uri: idportenConfig.redirectUri,
        response_type: idportenConfig.responseType[0],
        response_mode: "query",
        nonce: session.nonce,
        state: session.state,
        resource: "https://nav.no",
        acr_values: "Level4",
    });
};

const endSession = (idToken) => {
    return idportenClient.endSessionUrl({
        id_token_hint: idToken,
        post_logout_redirect_uri: idportenClient.postLogoutRedirectUri
    });
};

const validateOidcCallback = async (req) => {
    const params = idportenClient.callbackParams(req);

    const session = req.session;
    const nonce = session.nonce;
    const state = session.state;

    const additionalClaims = {
        clientAssertionPayload: {
            aud: idportenMetadata.issuer,
        },
    };

    return idportenClient
        .callback(idportenConfig.redirectUri, params, { nonce, state }, additionalClaims)
        .catch((err) => Promise.reject(`error in oidc callback: ${err}`))
        .then(async (tokenSet) => {
            return tokenSet;
        });
};

const exchangeToken = async (idportenToken) => {
    const clientAssertion = await createClientAssertion();

    return tokenxClient
        .grant({
            grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
            client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
            token_endpoint_auth_method: "private_key_jwt",
            client_assertion: clientAssertion,
            subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
            subject_token: idportenToken,
            audience: appConfig.targetAudience,
        })
        .then((tokenSet) => {
            return Promise.resolve(tokenSet.access_token);
        })
        .catch((err) => {
            logger.error("Feil under utveksling av token: ", err);
            return Promise.reject(err);
        });
};

const createClientAssertion = async () => {
    const now = Math.floor(Date.now() / 1000);

    const payload = {
        sub: tokenxConfig.clientID,
        iss: tokenxConfig.clientID,
        aud: tokenxMetadata.token_endpoint,
        jti: ULID.ulid(),
        nbf: now,
        iat: now,
        exp: now + 60, // max 120
    };

    const key = await asKey(tokenxConfig.privateJwk);

    const options = {
        algorithm: "RS256",
        header: {
            kid: key.kid,
            typ: "JWT",
            alg: "RS256",
        },
    };

    return jwt.sign(payload, key.toPEM(true), options);
};

const asKey = async (jwk) => {
    if (!jwk) throw Error("JWK Mangler");

    return jose.JWK.asKey(jwk).then((key) => {
        return Promise.resolve(key);
    });
};

const refresh = (oldTokenSet) => {
    const additionalClaims = {
        clientAssertionPayload: {
            aud: idportenMetadata.issuer,
        },
    };
    return idportenClient.refresh(new TokenSet(oldTokenSet), additionalClaims);
};

const init = async () => {
    const idporten = await Issuer.discover(idportenConfig.discoveryUrl);
    const tokenx = await Issuer.discover(tokenxConfig.discoveryUrl);
    tokenxMetadata = tokenx;
    idportenMetadata = idporten;

    logger.info(`Discovered IDPorten @ ${idporten.issuer}`);
    logger.info(`Discovered TokenX @ ${tokenx.issuer}`);

    try {
        const idportenJwk = JSON.parse(idportenConfig.clientJwk);
        idportenClient = new idporten.Client(
            {
                client_id: idportenConfig.clientID,
                token_endpoint_auth_method: "private_key_jwt",
                token_endpoint_auth_signing_alg: "RS256",
                redirect_uris: [idportenConfig.redirectUri],
                response_types: ["code"],
            },
            {
                keys: [idportenJwk],
            }
        );

        tokenxClient = new tokenx.Client({
            client_id: tokenxConfig.clientID,
            redirect_uris: [tokenxConfig.redirectUri, "http://localhost:8080/oauth2/callback"],
            token_endpoint_auth_method: "none",
        });

        logger.info("Opprettet klienter for IDPorten og TokenX");

        return Promise.resolve({ idporten: idportenClient, tokenx: tokenxClient });
    } catch (err) {
        logger.error("Feil oppsto under parsing av jwt eller opprettelse av klientene", err);
        return Promise.reject(err);
    }
};

module.exports = {
    setup,
    authUrl,
    validateOidcCallback,
    endSession,
    exchangeToken,
    refresh,
};
