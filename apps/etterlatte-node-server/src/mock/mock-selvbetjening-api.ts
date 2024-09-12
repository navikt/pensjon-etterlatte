import { STOR_SNERK } from './mock-user'
import parser from 'body-parser'
import { NextFunction, Request, Response } from 'express'
import config from '../config'
import NodeCache from 'node-cache'
import {
    innledningTilInntektsjusteringTestBlocks,
    skjemaProgresjonTestBlocks,
    spraakVelgerTestBlock,
    testBlocks,
} from './data/sanityBlocks'

const cache = new NodeCache()

export const mockSelvbetjeningApi = (app: any) => {
    const innloggetBruker = STOR_SNERK

    app.use(parser.json())
    app.use(function (req: Request, res: Response, next: NextFunction) {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
        res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
        res.setHeader('Access-Control-Allow-Credentials', 'true')

        next()
    })

    app.get(`${config.app.basePath}/api/api/person/innlogget`, (req: Request, res: Response) =>
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

    app.get(`${config.app.basePath}/api/sanity`, (req: Request, res: Response) => {
        const sanityQuery = req.query.sanityQuery
        if (sanityQuery?.toString().includes('innledningTilInntektsjustering'))
            res.send(innledningTilInntektsjusteringTestBlocks)
        else if (sanityQuery?.toString().includes('spraakVelger')) res.send(spraakVelgerTestBlock)
        else if (sanityQuery?.toString().includes('skjemaProgresjon')) res.send(skjemaProgresjonTestBlocks)
        else res.send(testBlocks)
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
