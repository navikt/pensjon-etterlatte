import { Issuer } from 'openid-client';
import jwt from 'jsonwebtoken';
import { ulid } from 'ulid';
import jose from 'node-jose';
import logger from '../monitoring/logger';
import config from '../config';

const tokenxConfig: any = config.tokenx; //ITokenXConfig

class TokenXClient {
    private tokenxClient: any = null;
    private audience: any = null;

    constructor() {
        logger.info("Setter opp TokenX");

        this.init().then((client: any) => {
            this.tokenxClient = client
        }).catch(() => process.exit(1));
    }

    exchangeToken = async (idportenToken: any) => {
        const clientAssertion = await this.createClientAssertion();

        return this.tokenxClient
                .grant({
                    grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
                    client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
                    token_endpoint_auth_method: "private_key_jwt",
                    client_assertion: clientAssertion,
                    subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
                    subject_token: idportenToken,
                    audience: config.app.targetAudience,
                })
                .then((tokenSet: any) => {
                    return Promise.resolve(tokenSet.access_token);
                })
                .catch((err: any) => {
                    logger.error("Feil under utveksling av token: ", err);
                    return Promise.reject(err);
                });
    };

    private createClientAssertion = async () => {
        const now = Math.floor(Date.now() / 1000);

        const payload = {
            sub: tokenxConfig.clientID,
            iss: tokenxConfig.clientID,
            aud: this.audience,
            jti: ulid(),
            nbf: now,
            iat: now,
            exp: now + 60, // max 120
        };

        const key = await this.asKey(tokenxConfig.privateJwk);

        const options: any = {
            algorithm: "RS256",
            header: {
                kid: key.kid,
                typ: "JWT",
                alg: "RS256",
            },
        };

        return jwt.sign(payload, key.toPEM(true), options);
    };

    private asKey = async (jwk: any) => {
        if (!jwk) throw Error("JWK Mangler");

        return jose.JWK.asKey(jwk).then((key: any) => {
            return Promise.resolve(key);
        });
    };

    private init = async () => {
        const tokenx = await Issuer.discover(tokenxConfig.discoveryUrl);
        this.audience = tokenx.token_endpoint;

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

export default TokenXClient;
