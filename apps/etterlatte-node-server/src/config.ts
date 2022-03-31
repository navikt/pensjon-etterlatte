const env = {
    isProdCluster: process.env.NAIS_CLUSTER_NAME === 'prod-gcp',
    isLabsCluster: process.env.NAIS_CLUSTER_NAME === 'labs-gcp',
}

const app = {
    basePath: process.env.BASE_PATH!!,
    apiUrl: process.env.API_URL!!,
    port: process.env.PORT || 8080,
    targetAudience: process.env.AUDIENCE,
}

const tokenx = {
    discoveryUrl: process.env.TOKEN_X_WELL_KNOWN_URL,
    clientID: process.env.TOKEN_X_CLIENT_ID,
    privateJwk: process.env.TOKEN_X_PRIVATE_JWK,
}

export default {
    app,
    env,
    tokenx,
}
