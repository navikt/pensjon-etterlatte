import express from "express"
import path from "path"
import decorator from "./decorator";
import authRoutes from './auth/auth-routes';
import api from "./api"
import config from "./config";
import prometheus from './prometheus'
import logger from "./log/logger";

const basePath = config.app.basePath;
const buildPath = path.resolve(__dirname, "../build");

const app = express();

app.set("trust proxy", 1);
app.use(basePath, express.static(buildPath, {index: false}));

// Log all errors
app.use((err: any, req: any, res: any, next: any) => {
    logger.error(`Error occurred: ${err}`);
    next();
});

// Endpoints to verify is app is ready/alive
app.get(`${basePath}/isAlive|${basePath}/isReady`, (req: any, res: any) => {
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
