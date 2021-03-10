const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "build")));

app.use(/^(?!.*\/(internal|static)\/).*$/, (req, res) => {
    // TODO: Legge til dekorator
    res.sendFile(path.join(__dirname, "build", "index.html"));
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
