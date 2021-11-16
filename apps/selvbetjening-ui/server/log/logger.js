const config = require("../config");
const { createLogger, format, transports } = require("winston");
const { PrometheusTransport } = require("./transport")
const { Console } = transports;
const { colorize, combine, timestamp, simple, json } = format;

/* Bruker json() for å sikre korrekt formatering i Logstash */
const production = combine(timestamp(), json());

/* Bruker simple() for lettlest logg (lokal stdout/stderr) */
const dev = combine(colorize(), simple());

class WinstonLogger extends createLogger {
    constructor() {
        super({
            level: process.env.NODE_LOG_LEVEL || "warn",
            format: config.env.isProduction ? production : dev,
            transports: [new Console(), new PrometheusTransport()]
        });
    }
}

module.exports = new WinstonLogger();
