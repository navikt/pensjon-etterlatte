const client = require('prom-client')

class Prometheus {
    constructor() {
        const collectDefaultMetrics = client.collectDefaultMetrics;

        this.register = new client.Registry();

        collectDefaultMetrics({
            register: this.register
        });
    }
}

module.exports = new Prometheus();
