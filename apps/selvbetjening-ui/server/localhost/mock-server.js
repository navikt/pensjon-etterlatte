const express = require("express");
const parser = require("body-parser");
const NodeCache = require("node-cache");
const {
    SEDAT_RIPSBÆRBUSK,
    TRIVIELL_MIDTPUNKT, // For ung til å søke
    KRAFTIG_GAPAHAUK, // For gammel til å søke
    NOBEL_TØFFELDYR,
    STOR_SNERK
} = require("./mock-user");

const app = express();
const cache = new NodeCache();

const innloggetBruker = STOR_SNERK;

app.use(parser.json());

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    next();
});

app.get("/api/person/innlogget", (req, res) => res.json(innloggetBruker));

app.post("/api/api/soeknad", (req, res) => {
    let id = cache.get("id");

    if (!!id)
        return id;

    const newID = Math.floor(Math.random() * 100)
    cache.set("id", newID);

    setTimeout(() => {
        res.json({id: newID})
    }, 1500);
});

app.get("/api/api/kladd", (req, res) => {
    const soeknad = cache.get(innloggetBruker.foedselsnummer);

    res.json({soeknad})
});

app.post("/api/api/kladd", (req, res) => {
    const soeknad = JSON.stringify(req.body);

    cache.set(innloggetBruker.foedselsnummer, soeknad);

    res.sendStatus(200)
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});
