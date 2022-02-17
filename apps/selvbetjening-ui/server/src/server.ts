import express, { Request, Response } from "express"
import path from "path"
import decorator from "./decorator";
import api from "./api"
import config from "./config";
import prometheus from './monitoring/prometheus'
import logger from "./monitoring/logger";
import { mockApi } from "./mock/mock-api";
import { TokenSet } from "openid-client";

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
app.get(`${basePath}/isAlive|${basePath}/isReady`, (req: Request, res: Response) => {
    res.send("OK");
});

app.get(`${basePath}/metrics`, async (req, res) => {
    res.set('Content-Type', prometheus.register.contentType);
    res.end(await prometheus.register.metrics())
});

if (config.env.isLabsCluster) {
    mockApi(app)
} else {
    app.get(`${basePath}/oauth2/session`, async (req: any, res: any) => {
        console.log("Traff endepunkt for sesjon")

        const { authorization } = req.headers
        const token = authorization!!.split(' ')[1]

        if (token) {
            const expiry = new TokenSet(token).expires_in;

            res.send(`${expiry}`);
        } else {
            res.sendStatus(401);
        }
    });

    api.setup(app);
}

app.use(/^(?!.*\/(internal|static)\/).*$/, decorator(`${buildPath}/index.html`));

const port = config.app.port;
app.listen(port, () => {
    logger.info(`App listening on port: ${port}`);
});
