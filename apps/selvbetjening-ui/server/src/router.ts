import express from 'express';
import fetch from 'node-fetch';
import TokenXClient from './auth/tokenx';
import config from './config';
import logger from './monitoring/logger';

const { exchangeToken } = new TokenXClient();

export const sendSoeknad = () => {
    const router = express.Router();

    router.post(`${config.app.basePath}/api/api/soeknad`, express.json(), async (req: any, res: any) => {
        const { authorization } = req.headers
        const token = authorization!!.split(' ')[1]

        const soeknader: any[] = req.body.soeknader.map((soeknad: any) => {
            return {
                ...soeknad,
                imageTag: process.env.NAIS_APP_IMAGE?.replace(/^.*selvbetjening-ui:(.*)/, "$1")
            }
        });

        try {
            await exchangeToken(token).then(
                (accessToken) => {
                    const headers = {
                        ...req.headers,
                        authorization:  `Bearer ${accessToken}`
                    };

                    fetch(`${config.app.apiUrl}/api/soeknad`, {
                        method: "post",
                        headers: headers,
                        body: JSON.stringify({soeknader}),
                    }).then((response: any) => {
                            if (response.status !== 200) {
                                return res.status(response.status).send("Det skjedde en feil.");
                            }
                            return res.status(200).send("ok")
                        })
                        .catch((e: any) => {
                            throw e;
                        });
                },
                (error) => {
                    logger.error("Feil oppsto ved endring av request headers", error);
                    throw error;
                }
            );
        } catch (e) {
            console.log("Feilmelding: ", e);
            return res.status(500).send("Error ved innsending av søknad");
        }
    });
    return router;
};
