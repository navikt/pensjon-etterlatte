const express = require("express");
const parser = require("body-parser");
const NodeCache = require("node-cache");

const app = express();
const cache = new NodeCache();

const foedselsnummer = "26117512737";

app.use(parser.json());

app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    next();
});

app.route("/api/person/innlogget")
        .get((req, res) => {
            res.json({
                fornavn: "SEDAT",
                etternavn: "RIPSBÆRBUSK",
                foedselsnummer,
                foedselsaar: 1975,
                foedselsdato: new Date(1975, 10, 26),
                adresse: "Fyrstikkaléen 1",
                husnummer: 1,
                husbokstav: null,
                postnummer: "0758",
                poststed: "Oslo",
                statsborgerskap: "Norsk",
                sivilstatus: "Ugift",
            })
        });

app.route("/api/api/soeknad")
        .post((req, res) => {
            let id = cache.get("id");

            if (!!id)
                return id;

            const newID = Math.floor(Math.random() * 100)
            cache.set("id", newID);
            res.json({ id: newID })
        });

app.get("/api/api/kladd", (req, res) => {
    const soeknad = cache.get(foedselsnummer);

    res.json({ soeknad })
});

app.post("/api/api/kladd", (req, res) => {
    const soeknad = JSON.stringify(req.body);

    cache.set(foedselsnummer, soeknad);

    res.sendStatus(200)
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
});
