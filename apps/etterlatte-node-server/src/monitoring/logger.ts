import { createLogger, format, transports } from 'winston'
import { PrometheusTransport } from './transport'
import { v4 as uuid } from 'uuid'

const { Console } = transports
const { colorize, combine, timestamp, simple, json } = format

/* Bruker json() for å sikre korrekt formatering i Logstash */
const production = combine(timestamp(), json())

/* Bruker simple() for lettlest logg (lokal stdout/stderr) */
const dev = combine(colorize(), simple())

const correlationId = uuid()

const WinstonLogger = createLogger({
    defaultMeta: { x_correlation_id: correlationId },
    level: 'info',
    format: !!process.env.NAIS_CLUSTER_NAME ? production : dev,
    transports: [new Console(), new PrometheusTransport()],
})

export default WinstonLogger
