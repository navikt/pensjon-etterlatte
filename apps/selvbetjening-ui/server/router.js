const express = require("express");
const fetch = require("node-fetch");
const TokenXClient = require("./auth/tokenx");
const config = require("./config");
const { generateSummary } = require("./generateSummary");

const { exchangeToken } = new TokenXClient();

const deleteUnwantedFields = (soeknad) => {
  delete soeknad.omDeg.erValidert;
  delete soeknad.omDenAvdoede.erValidert;
  delete soeknad.omDegOgAvdoed.erValidert;
  delete soeknad.dinSituasjon.erValidert;
  delete soeknad.opplysningerOmBarn.erValidert;

  return soeknad;
}

const sendSoeknad = () => {
    const router = express.Router();

    router.post(
        `${config.app.basePath}/api/api/soeknad`, express.json(),
        async (req, res) => {

            const soeknadBody = deleteUnwantedFields(req.body.soeknad);
            try {
                const oppsummering = await generateSummary(soeknadBody, req.body.bruker, req.body.locale);
                body = { utfyltSoeknad: soeknadBody, oppsummering };
                exchangeToken(req.session.tokens.access_token).then(
                  (accessToken) => {
                      let headers = {
                        ...req.headers
                      };
                      headers.ImageTag = process.env.NAIS_APP_IMAGE?.replace(/^.*selvbetjening-ui:(.*)/, "$1")
                      headers.Authorization = `Bearer ${accessToken}`;                      
                      fetch(`${config.app.apiUrl}/api/soeknad`, {
                        method: "post",
                        headers: headers,
                        body: JSON.stringify(body)
                      }).then(response => {
                        return response.json()})
                      .then(data => {
                        res.send("ok")
                      }).catch((e) => {
                        throw e;
                      });
                  },
                  (error) => {
                      logger.error("Feil oppsto ved endring av request headers", error);
                      reject(error);
                  }
              );
            } catch (e) {
                console.log("Feilmelding: ", e);
                return res.status(500).send("Error ved innsending av søknad");
            }
        }
    );
    return router;
};

module.exports = {
    sendSoeknad
};
