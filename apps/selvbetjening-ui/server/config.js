// TODO: Sti til vårt endepunkt på NAV.no
const basePath = "";
const apiUrl = process.env.API_URL || "localhost:8085";

const app = {
    useSecureCookies: !!process.env.NAIS_CLUSTER_NAME,
    port: process.env.PORT || 8080,
    targetAudience: process.env.SELVBETJENING_AUDIENCE || "local:selvbetjening-api",
    cluster: process.env.NAIS_CLUSTER_NAME || "",
};

const session = {
    secret: process.env.SESSION_SECRET || "localhostsecret",
    maxAgeMs: process.env.SESSION_MAX_AGE_MS || 2 * 60 * 60 * 1000, // defaults to 2 hours
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT || 6379,
    redisPassword: process.env.REDIS_PASSWORD,
};

/*
 * https://doc.nais.io/security/auth/idporten/
 */
const idporten = {
    discoveryUrl:
        process.env.IDPORTEN_WELL_KNOWN_URL ||
        "https://oidc-ver2.difi.no/idporten-oidc-provider/.well-known/openid-configuration",
    clientID: process.env.IDPORTEN_CLIENT_ID || "debugger",
    clientJwk: process.env.IDPORTEN_CLIENT_JWK,
    redirectUri: process.env.IDPORTEN_REDIRECT_URI || "http://localhost:8080/oauth2/callback",
    postLogoutRedirectUri: process.env.IDPORTEN_POST_LOGOUT_REDIRECT_URI,
    domain: process.env.NAIS_CLUSTER_NAME === "prod-gcp" ? "nav.no" : "dev.nav.no",
    responseType: ["code"],
    scope: "openid profile",
};

const tokenx = {
    discoveryUrl:
        process.env.TOKEN_X_WELL_KNOWN_URL ||
        "https://oidc-ver2.difi.no/idporten-oidc-provider/.well-known/openid-configuration",
    clientID: process.env.TOKEN_X_CLIENT_ID || "debugger",
    privateJwk: process.env.TOKEN_X_PRIVATE_JWK,
};

module.exports = {
    basePath,
    apiUrl,
    app,
    session,
    idporten,
    tokenx,
};
