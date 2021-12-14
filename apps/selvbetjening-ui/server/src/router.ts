import express, { Request, Response } from 'express';
import fetch from 'node-fetch';
import TokenXClient from './auth/tokenx';
import config from './config';
import logger from './log/logger';
import { generateSummary } from './generateSummary';
import nbLocale from './locales/nb.json';
import nnLocale from './locales/nn.json';
import enLocale from './locales/en.json';

const { exchangeToken } = new TokenXClient();

export const sendSoeknad = () => {
    const router = express.Router();

    router.post(`${config.app.basePath}/api/oppsummering`, express.json(), async (req: Request, res: Response) => {
        const oppsummering = await generateSummary(req.body.soeknad, req.body.bruker, req.body.locale);
        res.send(oppsummering)
    });

    router.get(`${config.app.basePath}/api/locale/:locale`, (req: Request, res: Response) => {
        if(!req.params.locale) return res.status(500).send("Mangler locale-parameter");
        switch(req.params.locale) {
            case "nn":
                return res.json(nnLocale);
            case "en":
                return res.json(enLocale);
            default: 
                return res.json(nbLocale);
        }
    });

    router.post(`${config.app.basePath}/api/api/soeknad`, express.json(), async (req: any, res: any) => {
        const soeknader: any[] = req.body.soeknader.map((soeknad: any) => {
            return {
                ...soeknad,
                imageTag: process.env.NAIS_APP_IMAGE?.replace(/^.*selvbetjening-ui:(.*)/, "$1")
            }
        });

        try {
            await exchangeToken(req.session.tokens.access_token).then(
                (accessToken) => {
                    const headers = {
                        ...req.headers,
                        Authorization:  `Bearer ${accessToken}`
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
