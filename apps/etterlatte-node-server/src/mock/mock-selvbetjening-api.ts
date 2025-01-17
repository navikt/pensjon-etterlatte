import { STOR_SNERK_FORENKLET } from './mock-user'
import parser from 'body-parser'
import express, { NextFunction, Request, Response } from 'express'
import config from '../config'
import NodeCache from 'node-cache'
import { FeatureToggleStatus } from '../routers/unleashRouter'
import { sanityClient } from '../routers/sanityProxy'

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

    app.post(`${config.app.basePath}/api/api/oms/meld_inn_endringer`, (req: Request, res: Response) => {
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

    app.get(`${config.app.basePath}/api/sanity`, async (req: Request, res: Response) => {
        try {
            const sanityQuery = req.query.sanityQuery
            const sanityResponse = await sanityClient.fetch(sanityQuery?.toString() || '')
            res.status(200).send(JSON.stringify(sanityResponse))
        } catch (error) {
            console.log(error)

            res.status(500).send('Error')
        }
    })

    app.post(`${config.app.basePath}/api/feature`, express.json(), (req: Request, res: Response) => {
        res.send([
            {
                name: 'oms-meld-inn-endring-skjema',
                status: FeatureToggleStatus.PAA,
            },
            {
                name: 'oms-inntektsjustering-skjema',
                status: FeatureToggleStatus.PAA,
            },
        ])
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
