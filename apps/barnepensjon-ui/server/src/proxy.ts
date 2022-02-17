import { Request, RequestHandler, Response } from 'express'
import fetch from 'node-fetch'
import logger from './monitoring/logger'
import TokenXClient from './auth/tokenx'

const { exchangeToken } = new TokenXClient()

const prepareSecuredRequest = async (req: Request) => {
    const { authorization } = req.headers
    const token = authorization!!.split(' ')[1]

    const accessToken = await exchangeToken(token).then((accessToken) => accessToken)

    const headers: any = {
        ...req.headers,
        authorization: `Bearer ${accessToken}`,
    }

    const body = !!req.body ? JSON.stringify(req.body) : undefined

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

            fetch(`${host}${req.path}`, request)
                .then((response: any) => {
                    if ([200, 404, 409].includes(response.status)) {
                        logger.info(`${response.status} ${response.statusText}: ${req.method} ${req.path}`)
                        return response.json()
                    } else {
                        logger.error(`${response.status} ${response.statusText}: ${req.method} ${req.path}`)
                        return response.text()
                    }
                })
                .then((response) => res.send(response))
        } catch (error) {
            logger.error(`Feilet kall (${req.method} - ${req.path}): `, error)

            return res.status(500).send('Error')
        }
    }
}
