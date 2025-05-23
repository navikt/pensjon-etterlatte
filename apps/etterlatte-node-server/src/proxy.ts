import { Request, RequestHandler, Response } from 'express'
import { requestTokenxOboToken, validateIdportenToken } from '@navikt/oasis'
import config from './config'
import { logger } from './monitoring/logger'
import fetch from 'node-fetch'

const isEmpty = (obj: any) => !obj || !Object.keys(obj).length

const isOK = (status: any) => [200, 404, 409].includes(status)

const prepareSecuredRequest = async (req: Request, token: any) => {
    const validation = await validateIdportenToken(token)
    if (!validation.ok) {
        logger.error('Validering av token feilet: ', validation.error)
        throw validation.error
    }

    const obo = await requestTokenxOboToken(token, config.app.targetAudience!)
    if (!obo.ok) {
        logger.error('Henting av obo-token feilet: ', obo.error)
        throw obo.error
    }

    const headers: any = {
        ...req.headers,
        authorization: `Bearer ${obo.token}`,
        x_correlation_id: logger.defaultMeta.x_correlation_id,
    }

    let body = undefined
    if (!isEmpty(req.body) && req.method === 'POST') {
        const imageTag = process.env.NAIS_APP_IMAGE?.replace(/^.*:(.*)/, '$1')
        if (req.path === '/api/soeknad') {
            const soeknader: any[] = req.body.soeknader.map((soeknad: any) => ({
                ...soeknad,
                imageTag,
            }))
            body = JSON.stringify({ soeknader })
        } else {
            body = JSON.stringify(req.body)
        }
    }

    return {
        method: req.method,
        body,
        headers,
    }
}

export default function proxy(host: string): (req: Request, res: Response) => Promise<void> {
    return async (req: Request, res: Response) => {
        try {
            const token = getHeaderTokenReq(req)
            if (!token) {
                res.sendStatus(401)
                return
            }
            const request = await prepareSecuredRequest(req, token)

            const params = new URLSearchParams({
                ...req.query,
                kilde: process.env.NAIS_APP_NAME!!,
            })

            const response = await fetch(`${host}${req.path}?${params}`, request)

            if (isOK(response.status)) {
                logger.info(sanitize(`${response.status} ${response.statusText}: ${req.method} ${req.path}`))
            } else {
                logger.error(sanitize(`${response.status} ${response.statusText}: ${req.method} ${req.path}`))
            }

            res.status(response.status).send(await response.text())
        } catch (error) {
            logger.error(sanitize(`Feilet kall (${req.method} - ${req.path}): `), error)

            res.status(500).send('Error')
        }
    }
}

export const getHeaderTokenReq = (req: Request) => {
    const { authorization } = req.headers
    return authorization?.split(' ')[1]
}

function sanitize(value: String) {
    return value.replace(/[\n\r]/g, '');
}
