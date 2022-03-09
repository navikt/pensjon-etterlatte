import parser from 'body-parser'
import NodeCache from 'node-cache'
import mockLand from './landMock'

import {
  SEDAT_RIPSBÆRBUSK,
  TRIVIELL_MIDTPUNKT, // For ung til å søke
  KRAFTIG_GAPAHAUK, // For gammel til å søke
  NOBEL_TØFFELDYR,
  STOR_SNERK,
} from './mock-user'
import config from '../config'
import { Request, Response, NextFunction } from 'express'

const cache = new NodeCache()

export const mockApi = (app: any) => {
  const innloggetBruker = STOR_SNERK

  app.use(parser.json())
  app.use(function (req: Request, res: Response, next: NextFunction) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
    res.setHeader('Access-Control-Allow-Credentials', 'true')

    next()
  })

  app.post(`${config.app.basePath}/api/api/soeknad`, async (req: Request, res: Response) => {
    res.sendStatus(200)
  })

  app.get(`${config.app.basePath}/api/person/innlogget`, (req: Request, res: Response) =>
    setTimeout(() => res.json(innloggetBruker), 1000)
  )

  app.get(`${config.app.basePath}/api/api/kladd`, (req: Request, res: Response) => {
    const soeknad = cache.get(innloggetBruker.foedselsnummer)

    if (!soeknad) res.sendStatus(404)
    else res.json({ payload: soeknad })
  })

  app.post(`${config.app.basePath}/api/api/kladd`, (req: Request, res: Response) => {
    const soeknad = JSON.stringify(req.body)

    cache.set(innloggetBruker.foedselsnummer, soeknad)

    res.sendStatus(200)
  })

  app.delete(`${config.app.basePath}/api/api/kladd`, (req: Request, res: Response) => {
    cache.del(innloggetBruker.foedselsnummer)

    res.sendStatus(200)
  })

  app.get(`${config.app.basePath}/api/kodeverk/alleland`, (req: Request, res: Response) => {
    return res.json(mockLand)
  })

  app.get(`${config.app.basePath}/session`, async (req: Request, res: Response) => {
    const date = new Date()
    date.setHours(date.getHours() + 1)
    res.send(`${date.getTime()}`)
  })
}
