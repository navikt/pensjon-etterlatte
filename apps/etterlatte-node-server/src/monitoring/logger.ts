import { createLogger, format, transports } from 'winston'
import { PrometheusTransport } from './transport'
import rTracer from 'cls-rtracer'

const { Console } = transports
const { colorize, combine, timestamp, simple, json } = format

/* Bruker json() for å sikre korrekt formatering i Logstash */
const production = combine(timestamp(), json())

/* Bruker simple() for lettlest logg (lokal stdout/stderr) */
const dev = combine(colorize(), simple())

const consoleTransport = new Console()
const prometheusTransport = new PrometheusTransport()

export const logger = createLogger({
    defaultMeta: {
        get x_correlation_id() {
            return rTracer.id()
        },
    },
    level: 'info',
    format: !!process.env.NAIS_CLUSTER_NAME ? production : dev,
    transports: [consoleTransport, new PrometheusTransport()],
})



export const frontendLogger = createLogger({
    level: 'info',
    format: process.env.NAIS_CLUSTER_NAME ? production : dev,
    defaultMeta: {
        service: 'bp eller oms...',
    },
    transports: [consoleTransport, prometheusTransport],
})
