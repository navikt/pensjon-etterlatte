import express from 'express'
import { frontendLogger } from './logger'

export const loggerRouter = express.Router()
loggerRouter.post('/', express.json(), (req, res) => {
  const body = req.body
  if (!process.env.NAIS_CLUSTER_NAME) {
    frontendLogger.info(`Nais cluster unavailable: ${JSON.stringify(body)}`)
  } else if (body.type && body.type === 'info') {
    frontendLogger.info('Frontendlogging: ', JSON.stringify(body))
  } else {
      frontendLogger.error(
        `General error from frontend: ${JSON.stringify(body.data)} \n details: ${JSON.stringify(body.jsonContent)}`
      )
    res.sendStatus(200)
  }
})
