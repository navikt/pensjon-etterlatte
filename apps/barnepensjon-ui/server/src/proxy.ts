import { Express, Request, Response } from "express"
import fetch from "node-fetch"
import config from "./config"
import logger from "./monitoring/logger"
import TokenXClient from "./auth/tokenx"

const { exchangeToken } = new TokenXClient()

const setup = (app: Express) => {
    app.use(`${config.app.basePath}/api`, async (req: Request, res: Response) => {
        try {
            const { authorization } = req.headers
            const token = authorization!!.split(" ")[1]

            await exchangeToken(token)
                    .then(
                            async (accessToken) => {
                                const headers: any = {
                                    ...req.headers,
                                    authorization: `Bearer ${accessToken}`,
                                }

                                const body = !!req.body ? JSON.stringify(req.body) : undefined

                                const request = {
                                    method: req.method,
                                    body,
                                    headers,
                                }

                                fetch(`${config.app.apiUrl}${req.path}`, request)
                                        .then((response: any) => {
                                            logger.info(`${response.status} ${response.statusText}: ${req.method} ${req.path}`)
                                            return response.json()
                                        })
                                        .then(json => res.send(json))
                                        .catch((error) => {
                                            logger.error(`ERROR: ${req.method} ${req.path}`)
                                            throw error
                                        })
                            },
                            (error) => {
                                throw error
                            },
                    )
        } catch (error) {
            logger.error(`Feilet kall mot ${req.path}: `, error)

            return res.status(500).send("Error")
        }
    })
}

export default {
    setup,
}
