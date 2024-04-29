import express, { Request, Response } from 'express'
import path from 'path'
import decorator from './decorator'
import proxy from './proxy'
import config from './config'
import prometheus from './monitoring/prometheus'
import logger from './monitoring/logger'
import parser from 'body-parser'
import session from './auth/session'
import rTracer from 'cls-rtracer'
import {selftestRouter} from "./selftestRouter";

const basePath = config.app.basePath
const buildPath = path.resolve(__dirname, '../build')

const app = express()

app.use(
    rTracer.expressMiddleware({
        useHeader: true,
        headerName: 'x_correlation_id',
    })
)

app.set('trust proxy', 1)
app.use(basePath, express.static(buildPath, { index: false }))
app.use(parser.json())

app.use(`${basePath}/internal/selftest`, selftestRouter)

// Endpoints to verify is app is ready/alive
app.get(`${basePath}/isAlive|${basePath}/isReady`, (req: Request, res: Response) => {
    res.send('OK')
})

app.get(`${basePath}/metrics`, async (req: Request, res: Response) => {
    res.set('Content-Type', prometheus.register.contentType)
    res.end(await prometheus.register.metrics())
})

logger.info('Setting up session and proxy')

app.get(`${basePath}/session`, session())

app.use(`${config.app.basePath}/api`, proxy(config.app.apiUrl))

app.use(/^(?!.*\/(internal|static)\/).*$/, decorator(`${buildPath}/index.html`))

const port = config.app.port
app.listen(port, () => {
    logger.info(`App listening on port: ${port}`)
})
