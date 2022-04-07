import { createLogger, format, transports } from 'winston'
import { PrometheusTransport } from './transport'

const { Console } = transports
const { colorize, combine, timestamp, simple, json } = format

/* Bruker json() for å sikre korrekt formatering i Logstash */
const production = combine(timestamp(), json())

/* Bruker simple() for lettlest logg (lokal stdout/stderr) */
const dev = combine(colorize(), simple())

const WinstonLogger = createLogger({
    level: 'info',
    format: !!process.env.NAIS_CLUSTER_NAME ? production : dev,
    transports: [new Console(), new PrometheusTransport()],
})

export default WinstonLogger
