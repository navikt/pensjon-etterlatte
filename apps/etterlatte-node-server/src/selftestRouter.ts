import express from 'express'
import config from './config'
import { logger } from './monitoring/logger'

export const selftestRouter = express.Router()

selftestRouter.get('/', express.json(), async (req, res) => {
    try {
        logger.info('selftest')
        const applicationName = config.app.basePath.includes('/barnepensjon/soknad')
            ? 'barnepensjon-ui'
            : 'omstillingsstoenad-ui'
        logger.info('applicationName: ', applicationName)
        const statuscode = await fetch(`${config.app.apiUrl}/internal/selftest`)
            .then((res) => res.status)
            .catch((err) => {
                logger.warn(`Innsendt-soeknad is down.`, err)
                return 500
            })

        const result: IPingResult = {
            serviceName: 'innsendt-soeknad',
            result: statuscode === 200 ? ServiceStatus.UP : ServiceStatus.DOWN,
            endpoint: config.app.apiUrl,
            description: 'innsendt-soeknad',
        }

        const selfTestReport = {
            application: applicationName,
            timestamp: new Date().toISOString(),
            aggregateResult: result.result === ServiceStatus.UP ? 0 : 1,
            checks: [result],
        }
        res.json(selfTestReport)
    } catch (err) {
        logger.error('Got error on selftest mot innsendt-soeknad', err)
        res.sendStatus(500)
    }
})

interface IPingResult {
    serviceName: string
    result: ServiceStatus
    endpoint: string
    description: string
}

enum ServiceStatus {
    UP = 0,
    DOWN = 1,
}
