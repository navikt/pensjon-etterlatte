const express = require("express");
const proxy = require("express-http-proxy");
const path = require("path");
const getDecorator = require("./decorator");

const app = express();

const buildPath = path.resolve(__dirname, "../build");

app.use("/", express.static(buildPath, { index: false }));

// Selvbetjening API
const apiUrl = process.env.API_URL || "localhost:8085";
app.use("/api", proxy(apiUrl));

// Match everything except internal and static
app.use(/^(?!.*\/(internal|static)\/).*$/, (req, res) =>
    getDecorator(`${buildPath}/index.html`)
        .then((html) => {
            res.send(html);
        })
        .catch((e) => {
            console.error(e);
            res.status(500).send(e);
        })
);

// Endpoints to verify is app is ready/alive
app.get(`/isAlive|isReady`, (req, res) => {
    res.sendStatus(200);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});
