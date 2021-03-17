const express = require("express");
const proxy = require("express-http-proxy");
const path = require("path");
const getDecorator = require("./dekorator");

const app = express();

app.use("/api", proxy(process.env.API_URL));

app.use(express.static(path.join(__dirname, "build")));

app.use(/^(?!.*\/(internal|static)\/).*$/, (req, res) => {
    getDecorator()
        .then((fragments) => {
            res.render("index.html", fragments);
        })
        .catch((e) => {
            const error = `Failed to get decorator: ${e}`;
            console.log(error);
            res.status(500).send(error);
        });
});

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
