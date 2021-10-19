const express = require("express");
const path = require("path");
const decorator = require("./decorator");
const authRoutes = require("./auth/auth-routes")
const api = require("./api");
const config = require("./config");

const basePath = config.app.basePath;
const buildPath = path.resolve(__dirname, "../build");

const app = express();

app.set("trust proxy", 1);
app.use(basePath, express.static(buildPath, {index: false}));

// Endpoints to verify is app is ready/alive
app.get(`${basePath}/isAlive|${basePath}/isReady`, (req, res) => {
    res.send("OK");
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
    console.log(`App listening on port: ${port}`);
});
