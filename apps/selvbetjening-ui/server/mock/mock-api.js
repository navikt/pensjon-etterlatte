const parser = require("body-parser");
const NodeCache = require("node-cache");
const {
    SEDAT_RIPSBÆRBUSK,
    TRIVIELL_MIDTPUNKT, // For ung til å søke
    KRAFTIG_GAPAHAUK, // For gammel til å søke
    NOBEL_TØFFELDYR,
    STOR_SNERK
} = require("./mock-user");

const config = require("../config")

const cache = new NodeCache();

const mockApi = (app) => {
    const innloggetBruker = STOR_SNERK;

    app.use(parser.json());

    app.use(function (req, res, next) {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
        res.setHeader("Access-Control-Allow-Credentials", "true");

        next();
    });

    app.get(`${config.app.basePath}/api/person/innlogget`, (req, res) => setTimeout(() => res.json(innloggetBruker), 1000));

    app.post(`${config.app.basePath}/api/api/soeknad`, (req, res) => {
        let id = cache.get("id");

        if (!!id)
            return id;

        const newID = Math.floor(Math.random() * 100)
        cache.set("id", newID);
        cache.del(innloggetBruker.foedselsnummer);

        setTimeout(() => {
            res.sendStatus(200)
        }, 1000);
    });

    app.get(`${config.app.basePath}/api/api/kladd`, (req, res) => {
        const soeknad = cache.get(innloggetBruker.foedselsnummer);

        if (!soeknad) res.sendStatus(404);
        else res.json({soeknad})
    });

    app.post(`${config.app.basePath}/api/api/kladd`, (req, res) => {
        const soeknad = JSON.stringify(req.body);

        cache.set(innloggetBruker.foedselsnummer, soeknad);

        res.sendStatus(200)
    });

    app.delete(`${config.app.basePath}/api/api/kladd`, (req, res) => {
        cache.del(innloggetBruker.foedselsnummer);

        res.sendStatus(200);
    });
};

module.exports = {
    mockApi
};
