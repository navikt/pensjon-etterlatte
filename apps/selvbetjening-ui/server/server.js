const express = require("express");
const path = require("path");
const prometheus = require("./prometheus");
const logger = require("./log/logger");
const decorator = require("./decorator");
const authRoutes = require("./auth/auth-routes");
const api = require("./api");
const config = require("./config");

const basePath = config.app.basePath;
const buildPath = path.resolve(__dirname, "../build");

const app = express();

app.set("trust proxy", 1);
app.use(basePath, express.static(buildPath, {index: false}));

// Log all errors
app.use((err, req, res, next) => {
    logger.error(`Error occurred: ${err}`);
    next();
});

// Endpoints to verify is app is ready/alive
app.get(`${basePath}/isAlive|${basePath}/isReady`, (req, res) => {
    res.send("OK");
});

app.get(`${basePath}/metrics`, async (req, res) => {
    res.set('Content-Type', prometheus.register.contentType);
    res.end(await prometheus.register.metrics())
});

if (config.env.isLabsCluster) {
    api.mock(app);
} else {
    authRoutes.setup(app);
    api.setup(app);
}

decorator.setup(app, `${buildPath}/index.html`);

const port = config.app.port;
app.listen(port, () => {
    logger.info(`App listening on port: ${port}`);
});
