import { Request, RequestHandler, Response } from 'express'
import fetch from 'node-fetch'
import logger from './monitoring/logger'
import TokenXClient from './auth/tokenx'

const { exchangeToken } = new TokenXClient()

const isEmpty = (obj: any) => !obj || !Object.keys(obj).length

const isOK = (status: any) => [200, 404, 409].includes(status)

const prepareSecuredRequest = async (req: Request) => {
    const { authorization } = req.headers
    const token = authorization!!.split(' ')[1]

    const accessToken = await exchangeToken(token).then((accessToken) => accessToken)

    const headers: any = {
        ...req.headers,
        authorization: `Bearer ${accessToken}`,
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

export default function proxy(host: string): RequestHandler {
    return async (req: Request, res: Response) => {
        try {
            const request = await prepareSecuredRequest(req)

            const response = await fetch(`${host}${req.path}?kilde=${process.env.NAIS_APP_NAME}`, request)

            if (isOK(response.status)) {
                logger.info(`${response.status} ${response.statusText}: ${req.method} ${req.path}`)
            } else {
                logger.error(`${response.status} ${response.statusText}: ${req.method} ${req.path}`)
            }

            return res.status(response.status).send(await response.text())
        } catch (error) {
            logger.error(`Feilet kall (${req.method} - ${req.path}): `, error)

            return res.status(500).send('Error')
        }
    }
}
