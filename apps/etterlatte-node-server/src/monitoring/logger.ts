import { createLogger, format, transports } from 'winston'
import { PrometheusTransport } from './transport'
import rTracer from 'cls-rtracer'
// import { v4 as uuid } from 'uuid'

const { Console } = transports
const { colorize, combine, timestamp, simple, json } = format

/* Bruker json() for å sikre korrekt formatering i Logstash */
const production = combine(timestamp(), json())

/* Bruker simple() for lettlest logg (lokal stdout/stderr) */
const dev = combine(colorize(), simple())

const WinstonLogger = createLogger({
    defaultMeta: {
        get x_correlation_id() {
            return rTracer.id()
        },
    },
    level: 'info',
    format: !!process.env.NAIS_CLUSTER_NAME ? production : dev,
    transports: [new Console(), new PrometheusTransport()],
})

WinstonLogger.info(`rtracer: ${rTracer.id()}`)

export default WinstonLogger
