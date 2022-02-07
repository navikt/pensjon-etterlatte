const testJwk = JSON.stringify({
    p: "36qWbr6zTCe4xM3OLpT_x9mcSbNvnx9Sr-z9GHHS4aCQS7JWirw3ez-8vWM71jypLIbUUj7ym_Dbd98IJtc9S6o8j5QejC92Y5EJqtnmKEkKnD4HWLPruCIf8mPlWFPsQQxHeAB6vv1ki036cfaHnmlV7_Fsv2ftYKHfp86-ozE",
    kty: "RSA",
    q: "19dG8TqsgmvM37F5C_0V0EjBXd2FcJQUkeoZbZRBcAGeoFyDklkMuUwlIogF0fQPrp-UBoCoY_efz5Y4Y_jR00W9xpPcb2spC9UdmMRVaw6YhKHY1NOdvF_9pV8hI5QtpSglaCr9o6lCp78_wELjZe7-tFcZyN7C-LvyX63W7qc",
    d: "MK-8k59azRASyjD59fPySFdeo4BzHYsjObZ5Vxmblz2uD4CDKgLldQzG7ELiO4FCDhfpQklQFTpa1wIt-wFFMYW3-crTJv3gC-s3u5215yZIQ3ilMQXdXliultOQKGUnm9QHaTW0RZpgwOmOe4iRkbunrCUTPhbmiAJWzOXg1KtMAcc_q1-F5n1YpplzKLAORgRYcvfwaEKLag-FHQgqfokTp8-Lm2zWQ_2xr34ifKuQFWi79M8PMdpMzExGVoc_rDBbweXt4CxuZQTUzYp_F9D-RP4XOPl1Xb1kVXb5vW-dw3QlFHWOszwb7GK0GLHahJrs6sUHZ4I2HIHvrRPbAQ",
    e: "AQAB",
    use: "sig",
    kid: "test-id",
    qi: "heuqSTOqX0terJoTuYmudRYuldWg52KU4U-hsEFSYiOoGCuY5O-Wkqs66i28gGOlFAaU9rGvxIQd1ro9ag1TiZxyWPPtrVdyD-HwNYs11tdROTZ8lVFs6OYj3NhwZYd5TXpq4HNf-jf7yru2NF7jSWg6UR1TBXeBTHchQKdgnTo",
    dp: "Wi8VUvgPoYBOrwPww7WOYM2sh8cTFczycT8UWhvjFNjB9dOls3DqygZMGuz9PofdCrgeuj7pYdk_FNlYFxkofO7aVmY53vpwOPtNM5eChvHUlmUoXyrEu8z-pqSC4BeOpjfGRWukEohnVwgNGJB35HbCkOn-mDrWauU6IhZppbE",
    alg: "RS256",
    dq: "hGbwg8XkUNTkBkyN3obPvMcEpxneY2LTA3dBRfDt-1FjByf5JesuXPSSyw351AMNI6eMXDjMExaxl9ukl97oh9t-QLQvQsHPmgyPbUjyxQtdD-9gXZ26YvXXWHx0jai2H1vzJmVI1f5cfx5Ycw4VBFCJOgM8M_ZCT-arFXpEIH0",
    n: "vJRalsEoApXYdEFsrYo7QOcM36shQXTQvyXuiJPzqq-WpwOM7dCLUQJ7HRO07kKJAfdldwV7j1k1KELjwUozXQC_uGL28xByaP3BZ5JcTmBWz_X2tIRkxOcj8QYJYUaRBWF8gjISkbZC_Cli94NI5qkdSegGV4tjHYwGhk3qX1Pp0NULhxmfdiiMtkMj2PEGQGxl87tgUQrWjBZj1pcn-d7Tnw8uUNMt5tfqCzVXQcJefkuPTOetvFMSyMk8ismd1uxLie1sQ4I-KFnD9OMLVAHfuXNtLrQoPaYJVzqE7ix3f9y5kS8VMn8-UN42gxm6AMenJ0TXJFaAUnGAogoC9w",
})

const env = {
    isProduction: process.env.NODE_ENV === "production",
    isProdCluster: process.env.NAIS_CLUSTER_NAME === "prod-gcp",
}

const app = {
    basePath: "/barnepensjon/soknad",
    apiUrl: process.env.API_URL || "http://localhost:8085",
    useSecureCookies: !!process.env.NAIS_CLUSTER_NAME,
    port: process.env.PORT || 8080,
    targetAudience: process.env.SELVBETJENING_AUDIENCE || "local:selvbetjening-api",
    loginServiceLogoutUrl: process.env.LOGINSERVICE_LOGOUT_URL,
}

const tokenx = {
    discoveryUrl:
            process.env.TOKEN_X_WELL_KNOWN_URL ||
            "https://tokendings.dev-gcp.nais.io/.well-known/oauth-authorization-server",
    clientID: process.env.TOKEN_X_CLIENT_ID || "debugger",
    privateJwk: process.env.TOKEN_X_PRIVATE_JWK || testJwk,
}

export default {
    app,
    env,
    tokenx,
}
