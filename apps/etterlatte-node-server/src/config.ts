const env = {
    isProdCluster: process.env.NAIS_CLUSTER_NAME === 'prod-gcp',
    isSelvbetjeningApp: process.env.NAIS_CLUSTER_NAME === 'selvbetjening-ui',
}

const app = {
    basePath: process.env.BASE_PATH!!,
    apiUrl: process.env.API_URL!!,
    port: process.env.PORT || 8080,
    targetAudience: process.env.AUDIENCE,
}

const sanity = {
    token: process.env.SANITY_API_TOKEN,
    dataset: process.env.SANITY_DATASET_NAME,
    projectId: process.env.SANITY_PROJECT_ID,
}

export default {
    app,
    env,
    sanity,
}
