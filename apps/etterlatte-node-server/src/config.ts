const env = {
    isProdCluster: process.env.NAIS_CLUSTER_NAME === 'prod-gcp',
    isSelvbetjeningUIApp: process.env.NAIS_APP_NAME === 'selvbetjening-ui',
}

const app = {
    basePath: process.env.BASE_PATH!!,
    apiUrl: process.env.API_URL!!,
    port: process.env.PORT || 8080,
    targetAudience: process.env.AUDIENCE,
}

const sanity = {
    token: process.env.SANITY_API_TOKEN,
    dataset: 'selvbetjening-ui',
    projectId: process.env.SANITY_PROJECT_ID,
}

export default {
    app,
    env,
    sanity,
}
