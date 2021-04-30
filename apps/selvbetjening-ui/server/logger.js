const { createLogger, format, transports } = require("winston");
const { Console } = transports;
const { colorize, combine, timestamp, simple, json } = format;

const production = combine(timestamp(), json());

const dev = combine(colorize(), simple());

const logger = createLogger({
    level: process.env.NODE_LOG_LEVEL || "warn",
    format: process.env.NODE_ENV === "production" ? production : dev,
    transports: [new Console()],
});

module.exports = logger;
