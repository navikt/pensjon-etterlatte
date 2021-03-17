const express = require("express");
const proxy = require("express-http-proxy");
const path = require("path");
const mustacheExpress = require("mustache-express");
const getDecorator = require("./dekorator");

const app = express();

const buildPath = path.resolve(__dirname, "../build");

app.set("views", buildPath);
app.set("view engine", "mustache");
app.engine("html", mustacheExpress());

const apiUrl = process.env.API_URL || "localhost:8085";
app.use("/api", proxy(apiUrl));

// app.use(express.static(path.join(__dirname, "build")));
app.use("/", express.static(buildPath, { index: false }));

app.use(/^(?!.*\/(internal|static)\/).*$/, (req, res) =>
    getDecorator()
        .then((fragments) => {
            res.render("index.html", fragments);
        })
        .catch((e) => {
            const error = `Failed to get decorator: ${e}`;
            console.log(error);
            res.status(500).send(error);
        })
);

app.get("/isAlive", (req, res) => {
    res.sendStatus(200);
});

app.get("/isReady", (req, res) => {
    res.sendStatus(200);
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});
