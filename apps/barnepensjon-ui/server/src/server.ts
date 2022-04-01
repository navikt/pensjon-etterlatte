import express, { Request, Response } from 'express'
import path from 'path'
import decorator from './decorator'
import proxy from './proxy'
import config from './config'
import prometheus from './monitoring/prometheus'
import logger from './monitoring/logger'
import parser from 'body-parser'
import { mockApi } from './mock/mock-api'
import jwt from "jsonwebtoken";

const basePath = config.app.basePath
const buildPath = path.resolve(__dirname, '../build')

const app = express()

app.set('trust proxy', 1)
app.use(basePath, express.static(buildPath, { index: false }))
app.use(parser.json())

// Endpoints to verify is app is ready/alive
app.get(`${basePath}/isAlive|${basePath}/isReady`, (req: Request, res: Response) => {
    res.send('OK')
})

app.get(`${basePath}/metrics`, async (req: Request, res: Response) => {
    res.set('Content-Type', prometheus.register.contentType)
    res.end(await prometheus.register.metrics())
})

if (config.env.isLabsCluster) {
    mockApi(app)
} else {
    app.use(`${config.app.basePath}/api`, proxy(config.app.apiUrl))

    app.get(`${config.app.basePath}/session`, async (req: Request, res: Response) => {
        const { authorization } = req.headers
        const token = authorization!!.split(' ')[1]

        if (token) {
            const decoded = jwt.decode(token)
            if (!decoded || typeof decoded === 'string') {
                res.sendStatus(500)
            } else {
                const exp = decoded['exp'] as number
                res.send(`${exp * 1000}`);
            }
        } else {
            res.sendStatus(401);
        }
    });
}

app.use(/^(?!.*\/(internal|static)\/).*$/, decorator(`${buildPath}/index.html`))

const port = config.app.port
app.listen(port, () => {
    logger.info(`App listening on port: ${port}`)
})
