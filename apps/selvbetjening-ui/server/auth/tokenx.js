const { Issuer } = require("openid-client");
const jwt = require("jsonwebtoken");
const ULID = require("ulid");
const jose = require("node-jose");
const logger = require("../log/logger");
const config = require("../config");

const tokenxConfig = config.tokenx;

class TokenXClient {
    #tokenxClient = null;
    #audience = null;

    constructor() {
        logger.info("Setter opp TokenX");

        this.#init().then((client) => {
            this.#tokenxClient = client
        }).catch(() => process.exit(1));
    }

    exchangeToken = async (idportenToken) => {
        const clientAssertion = await this.#createClientAssertion();

        return this.#tokenxClient
                .grant({
                    grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
                    client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
                    token_endpoint_auth_method: "private_key_jwt",
                    client_assertion: clientAssertion,
                    subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
                    subject_token: idportenToken,
                    audience: config.app.targetAudience,
                })
                .then((tokenSet) => {
                    return Promise.resolve(tokenSet.access_token);
                })
                .catch((err) => {
                    logger.error("Feil under utveksling av token: ", err);
                    return Promise.reject(err);
                });
    };

    #createClientAssertion = async () => {
        const now = Math.floor(Date.now() / 1000);

        const payload = {
            sub: tokenxConfig.clientID,
            iss: tokenxConfig.clientID,
            aud: this.#audience,
            jti: ULID.ulid(),
            nbf: now,
            iat: now,
            exp: now + 60, // max 120
        };

        const key = await this.#asKey(tokenxConfig.privateJwk);

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

    #asKey = async (jwk) => {
        if (!jwk) throw Error("JWK Mangler");

        return jose.JWK.asKey(jwk).then((key) => {
            return Promise.resolve(key);
        });
    };

    #init = async () => {
        const tokenx = await Issuer.discover(tokenxConfig.discoveryUrl);
        this.#audience = tokenx.token_endpoint;

        logger.info(`Discovered TokenX @ ${tokenx.issuer}`);

        try {
            const client = new tokenx.Client({
                client_id: tokenxConfig.clientID,
                redirect_uris: [tokenxConfig.redirectUri, "http://localhost:8080/oauth2/callback"],
                token_endpoint_auth_method: "none",
            });

            logger.info("Opprettet TokenX client");

            return Promise.resolve(client);
        } catch (err) {
            logger.error("Feil oppsto under parsing av jwt eller opprettelse av TokenX client", err);
            return Promise.reject(err);
        }
    };
}

module.exports = TokenXClient;
