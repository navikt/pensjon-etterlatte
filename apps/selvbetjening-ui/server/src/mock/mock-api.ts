import parser from 'body-parser';
import NodeCache from 'node-cache';
import mockLand from './landMock';
import nbLocale from '../locales/nb.json';
import nnLocale from '../locales/nn.json';
import enLocale from '../locales/en.json';

import {
    SEDAT_RIPSBÆRBUSK,
    TRIVIELL_MIDTPUNKT, // For ung til å søke
    KRAFTIG_GAPAHAUK, // For gammel til å søke
    NOBEL_TØFFELDYR,
    STOR_SNERK
} from './mock-user';
import config from '../config';
import { generateSummary } from '../generateSummary';
import { Request, Response, NextFunction } from 'express';


const cache = new NodeCache();

export const mockApi = (app: any) => {
    const innloggetBruker = STOR_SNERK;

    app.use(parser.json());
    app.use(function (req: Request, res: Response, next: NextFunction) {
        res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
        res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
        res.setHeader("Access-Control-Allow-Credentials", "true");

        next();
    });

    app.post(`${config.app.basePath}/api/oppsummering`, async (req: Request, res: Response) => {
        const oppsummering = await generateSummary(req.body.soeknad, req.body.bruker, req.body.locale);
        res.send(oppsummering)
    });

    app.post(`${config.app.basePath}/api/api/soeknad`, async (req: Request, res: Response) => {
        res.sendStatus(200)
    });

    app.get(`${config.app.basePath}/api/person/innlogget`, (req: Request, res: Response) => setTimeout(() => res.json(innloggetBruker), 1000));


    app.post(`${config.app.basePath}/api/api/soeknad`, (req: Request, res: Response) => {
        const id = cache.get("id");

        console.log(generateSummary(req.body.soeknad, req.body.bruker));
        if (!!id)
            return id;

        const newID = Math.floor(Math.random() * 100)
        cache.set("id", newID);
        cache.del(innloggetBruker.foedselsnummer);

        setTimeout(() => {
            res.sendStatus(200)
        }, 1000);
    });

    app.get(`${config.app.basePath}/api/api/kladd`, (req: Request, res: Response) => {
        const soeknad = cache.get(innloggetBruker.foedselsnummer);

        if (!soeknad) res.sendStatus(404);
        else res.json({ payload: soeknad })
    });

    app.post(`${config.app.basePath}/api/api/kladd`, (req: Request, res: Response) => {
        const soeknad = JSON.stringify(req.body);

        cache.set(innloggetBruker.foedselsnummer, soeknad);

        res.sendStatus(200)
    });

    app.delete(`${config.app.basePath}/api/api/kladd`, (req: Request, res: Response) => {
        cache.del(innloggetBruker.foedselsnummer);

        res.sendStatus(200);
    });

    app.get(`${config.app.basePath}/api/kodeverk/alleland`, (req: Request, res: Response) => {
        return res.json(mockLand)
    });

    app.get(`${config.app.basePath}/api/locale/:locale`, (req: Request, res: Response) => {
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

    app.get(`${basePath}/oauth2/session`, async (req: any, res: any) => {
        res.send("3600");
    });
};
