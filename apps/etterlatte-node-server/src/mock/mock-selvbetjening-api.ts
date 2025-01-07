import { STOR_SNERK_FORENKLET } from './mock-user'
import parser from 'body-parser'
import express, { NextFunction, Request, Response } from 'express'
import config from '../config'
import NodeCache from 'node-cache'
import {
    fantIkkeSidenTestBlocks,
    fellesKomponenterTestBlocks,
    ikkeGyldigForAaMeldeInntektTestBlocks,
    inntektsjusteringInnledningTestBlocks,
    inntektsjusteringInntektTilNesteAarTestBlocks,
    inntektsjusteringKvitteringTestBlocks,
    inntektsjusteringOppsummeringTestBlocks,
    inntektSkjemaLukketTestBlocks,
    systemUtilgjengeligTestBlocks,
    testBlocks,
} from './data/sanityBlocks'
import { FeatureToggleStatus } from '../routers/unleashRouter'

const cache = new NodeCache()

export const mockSelvbetjeningApi = (app: any) => {
    const innloggetBruker = STOR_SNERK_FORENKLET

    app.use(parser.json())
    app.use(function (req: Request, res: Response, next: NextFunction) {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
        res.setHeader('Access-Control-Allow-Credentials', 'true')

        next()
    })

    app.get(`${config.app.basePath}/api/api/person/innlogget/forenklet`, (req: Request, res: Response) =>
        setTimeout(() => res.json(innloggetBruker), 1000)
    )

    app.get(`${config.app.basePath}/api/api/inntektsjustering`, (req: Request, res: Response) => {
        const inntektsjustering = cache.get(innloggetBruker.foedselsnummer)
        if (!inntektsjustering) res.sendStatus(404)
        else res.send(inntektsjustering)
    })

    app.post(`${config.app.basePath}/api/api/inntektsjustering`, (req: Request, res: Response) => {
        const lagret = {
            tidspunkt: Date.now(),
            ...req.body,
        }

        cache.set(innloggetBruker.foedselsnummer, JSON.stringify(lagret))

        res.sendStatus(200)
    })

    app.get(`${config.app.basePath}/api/api/sak/oms/har_sak`, (req: Request, res: Response) => {
        const harOMSSak = {
            harOMSSak: true,
        }

        res.send(harOMSSak)
    })

    app.get(`${config.app.basePath}/api/sanity`, (req: Request, res: Response) => {
        const sanityQuery = req.query.sanityQuery
        if (sanityQuery?.toString().includes('inntektsjusteringInnledning')) {
            res.send(inntektsjusteringInnledningTestBlocks)
        } else if (sanityQuery?.toString().includes('inntektsjusteringInntektTilNesteAar')) {
            res.send(inntektsjusteringInntektTilNesteAarTestBlocks)
        } else if (sanityQuery?.toString().includes('inntektsjusteringOppsummering')) {
            res.send(inntektsjusteringOppsummeringTestBlocks)
        } else if (sanityQuery?.toString().includes('inntektsjusteringKvittering')) {
            res.send(inntektsjusteringKvitteringTestBlocks)
        } else if (sanityQuery?.toString().includes('ikkeGyldigForAaMeldeInntekt')) {
            res.send(ikkeGyldigForAaMeldeInntektTestBlocks)
        } else if (sanityQuery?.toString().includes('fellesKomponenter')) {
            res.send(fellesKomponenterTestBlocks)
        } else if (sanityQuery?.toString().includes('fantIkkeSiden')) {
            res.send(fantIkkeSidenTestBlocks)
        } else if (sanityQuery?.toString().includes('systemUtilgjengelig')) {
            res.send(systemUtilgjengeligTestBlocks)
        } else if (sanityQuery?.toString().includes('inntektSkjemaLukket')) {
            res.send(inntektSkjemaLukketTestBlocks)
        } else {
            res.send(testBlocks)
        }
    })

    app.post(`${config.app.basePath}/api/feature`, express.json(), (req: Request, res: Response) => {
        const featureTogglesNavn: string[] = req.body.featureTogglesNavn

        const alleFeatureToggles = []

        if (featureTogglesNavn.includes('oms-meld-inn-endring-skjema')) {
            alleFeatureToggles.push({
                name: 'oms-meld-inn-endring-skjema',
                status: FeatureToggleStatus.PAA,
            })
        }

        res.send(alleFeatureToggles)
    })

    app.get(`${config.app.basePath}/session`, async (req: Request, res: Response) => {
        const date = new Date()
        date.setHours(date.getHours() + 1)
        res.send(`${date.getTime()}`)
    })

    app.get(`${config.app.basePath}/logout`, async (req: any, res: any) => {
        res.sendStatus(200)
    })
}
