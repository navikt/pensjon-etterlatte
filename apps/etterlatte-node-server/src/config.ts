const env = {
    isProdCluster: process.env.NAIS_CLUSTER_NAME === 'prod-gcp',
}

const app = {
    basePath: process.env.BASE_PATH!!,
    apiUrl: process.env.API_URL!!,
    port: process.env.PORT || 8080,
    targetAudience: process.env.AUDIENCE,
}

export default {
    app,
    env,
}
