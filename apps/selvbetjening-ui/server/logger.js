const { createLogger, format, transports } = require("winston");
const { Console } = transports;
const { colorize, combine, timestamp, simple, printf } = format;

const logstashFormat = printf(({ level, message, timestamp }) => {
    return `{"@timestamp": "${timestamp}", "message": "${message}", "level": "${level.toUpperCase()}"`;
});

const production = combine(timestamp(), logstashFormat);

const dev = combine(colorize(), simple());

const logger = createLogger({
    level: process.env.NODE_LOG_LEVEL || "warn",
    format: process.env.NODE_ENV === "production" ? production : dev,
    transports: [new Console()],
});

module.exports = logger;
