const express = require("express");
const path = require("path");
const decorator = require("./decorator");
const authRoutes = require("./auth/auth-routes")
const api = require("./api");
const config = require("./config");

const basePath = config.app.basePath;
const buildPath = path.resolve(__dirname, "../build");
console.log(`buildPath: ${buildPath}`);

const app = express();

app.set("trust proxy", 1);
app.use(basePath, express.static(buildPath, {index: false}));
console.log(`basePath: ${basePath}`)

if (config.env.isLabsCluster) {
    api.mock(app);
} else {
    authRoutes.setup(app);
    api.setup(app);
}

decorator.setup(app, `${buildPath}/index.html`);

// Endpoints to verify is app is ready/alive
app.get(`${basePath}/isAlive|${basePath}/isReady`, (req, res) => {
    res.sendStatus(200);
});

const port = config.app.port;
app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
    console.log(`Current Github SHA: ${process.env.GITHUB_SHA}`)
});
