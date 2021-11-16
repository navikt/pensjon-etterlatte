const Transport = require("winston-transport");
const { Counter } = require("prom-client");
const prometheus = require("../prometheus")

class PrometheusTransport extends Transport {
    #register = null;
    #counter = null;

    constructor() {
        super();

        this.#register = prometheus.register;
        this.#counter = new Counter({
            name: "winston_events_total",
            help: "All log entries passed to winston, labelled with log level.",
            labelNames: ["level"],
            registers: [this.#register]
        })
    }

    log(info, callback) {
        setImmediate(() => {
            this.emit("logged", info);

            this.#counter.inc({ level: info.level });

            callback();
        })
    }
}

module.exports = {
    PrometheusTransport
};