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

const validateOidcCallback = async (req) => {
    const params = idportenClient.callbackParams(req);
    logger.info(`params: ${JSON.stringify(params)}`);

    const session = req.session;
    logger.info(`session: ${JSON.stringify(session)}`);

    const nonce = session.nonce;
    const state = session.state;

    logger.info(`idportenMetadata: ${JSON.stringify(idportenMetadata)}`);

    const additionalClaims = {
        clientAssertionPayload: {
            aud: idportenMetadata.issuer,
        },
    };

    logger.info(`idportenConfig: ${JSON.stringify(idportenConfig)}`);

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
            subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
            client_assertion: clientAssertion,
            audience: appConfig.targetAudience,
            subject_token: idportenToken,
        })
        .then((tokenSet) => {
            return Promise.resolve(tokenSet.access_token);
        })
        .catch((err) => {
            logger.error(`Error while exchanging token: ${err}`);
            return Promise.reject(err);
        });
};

const createClientAssertion = async () => {
    const now = Math.floor(Date.now() / 1000);
    return jwt.sign(
        {
            sub: tokenxConfig.clientID,
            aud: tokenxMetadata.token_endpoint,
            iss: tokenxConfig.clientID,
            exp: now + 60, // max 120
            iat: now,
            jti: ULID.ulid(),
            nbf: now,
        },
        await privateKeyToPem(tokenxConfig.privateJwk),
        { algorithm: "RS256" }
    );
};

const privateKeyToPem = async (jwk) => {
    return jose.JWK.asKey(jwk).then((key) => {
        return Promise.resolve(key.toPEM(true));
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

    logger.info(`discovered idporten @ ${idporten.issuer}`);
    logger.info(`discovered tokenx @ ${tokenx.issuer}`);

    try {
        const idportenJwk = JSON.parse(idportenConfig.clientJwk);
        logger.info("Successfully parsed IDPORTEN_CLIENT_JWK");
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

        const tokenxJwk = JSON.parse(tokenxConfig.privateJwk);
        logger.info("Successfully parsed TOKEN_X_PRIVATE_JWK");
        tokenxClient = new tokenx.Client(
            {
                client_id: tokenxConfig.clientID,
                token_endpoint_auth_method: "private_key_jwt",
            },
            {
                keys: [tokenxJwk],
            }
        );

        return Promise.resolve({ idporten: idportenClient, tokenx: tokenxClient });
    } catch (err) {
        logger.error("Error while parsing JWKs or creating clients.");
        logger.error(err);
        return Promise.reject(err);
    }
};

module.exports = {
    setup,
    authUrl,
    validateOidcCallback,
    exchangeToken,
    refresh,
};
