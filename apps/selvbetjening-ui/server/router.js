const express = require("express");
const proxy = require("express-http-proxy");
const parser = require("body-parser");
const config = require("./config");
const { generateSummary } = require("./generateSummary");

const sendSoeknad = (options) => {
    const router = express.Router();

    router.use(parser.json());
    router.post(
        `${config.app.basePath}/api/api/soeknad`,
        async (req, res, next) => {
            console.log(req.body);
            try {
                const oppsummering = await generateSummary(req.body.soeknad, req.body.bruker, req.body.locale);
                req.body = { utfyltSoeknad: req.body.soeknad, oppsummering };
                next();
            } catch (e) {
                console.log("Feilmelding: ", e);
                return res.status(500).send("Error ved innsending av søknad");
            }
        },
        proxy(config.app.apiUrl, options())
    );
    return router;
};

module.exports = {
    sendSoeknad
};
