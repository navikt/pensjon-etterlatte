import express from "express"
import path from "path"
import decorator from "./decorator"
import proxy from "./proxy"
// import proxy from "./mock-proxy"
import config from "./config"
import prometheus from "./monitoring/prometheus"
import logger from "./monitoring/logger"

const basePath = config.app.basePath
const buildPath = path.resolve(__dirname, "../build")

const app = express()

app.set("trust proxy", 1)
app.use(basePath, express.static(buildPath, { index: false }))

// Endpoints to verify is app is ready/alive
app.get(`${basePath}/isAlive|${basePath}/isReady`, (req: any, res: any) => {
    res.send("OK")
})

app.get(`${basePath}/metrics`, async (req, res) => {
    res.set("Content-Type", prometheus.register.contentType)
    res.end(await prometheus.register.metrics())
})

// TODO: Legge til ingress i loginservice for at det skal fungere
// loginservice.setup(app)
proxy.setup(app)

decorator.setup(app, `${buildPath}/index.html`)

const port = config.app.port
app.listen(port, () => {
    logger.info(`App listening on port: ${port}`)
})
