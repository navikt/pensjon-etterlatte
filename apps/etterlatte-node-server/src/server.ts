import path from 'node:path'
import parser from 'body-parser'
import rTracer from 'cls-rtracer'
import express, { type Request, type Response } from 'express'
import session from './auth/session'
import config from './config'
import decorator from './decorator'
import { logger } from './monitoring/logger'
import prometheus from './monitoring/prometheus'
import proxy from './proxy'
import { loggerRouter } from './routers/loggerRouter'
import sanityRouter from './routers/sanityRouter'
import { unleashRouter } from './routers/unleashRouter'
import { selftestRouter } from './selftestRouter'

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

// Endepunkt for metrics
app.get(`${basePath}/metrics`, async (req: Request, res: Response) => {
    res.set('Content-Type', prometheus.register.contentType)
    res.end(await prometheus.register.metrics())
})

logger.info('Setting up session and proxy')

app.use(`${basePath}/api/logg`, loggerRouter)
app.use(`${basePath}/api/sanity`, sanityRouter)
app.use(`${basePath}/api/feature`, unleashRouter)

app.get(`${basePath}/session`, session())

app.use(`${basePath}/api`, proxy(config.app.apiUrl))

app.use(/^(?!.*\/(internal|static)\/).*$/, decorator(`${buildPath}/index.html`))

const port = config.app.port
app.listen(port, () => {
    logger.info(`App listening on port: ${port}`)
})
