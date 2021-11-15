import express from "express"
import path from "path"
import decorator from "./decorator";
import authRoutes from './auth/auth-routes';
import api from "./api"
import config from "./config";
import prometheus from './prometheus'

const basePath = config.app.basePath;
const buildPath = path.resolve(__dirname, "../build");

const app = express();

app.set("trust proxy", 1);
app.use(basePath, express.static(buildPath, {index: false}));

// Endpoints to verify is app is ready/alive
app.get(`${basePath}/isAlive|${basePath}/isReady`, (req: any, res: any) => {
    res.send("OK");
});

if (config.env.isLabsCluster) {
    api.mock(app);
} else {
    prometheus.setup(app);
    authRoutes.setup(app);
    api.setup(app);
}

decorator.setup(app, `${buildPath}/index.html`);

const port = config.app.port;
app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});
