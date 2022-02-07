import { Express, Request, Response } from "express"
import fetch from "node-fetch"
import config from "./config"
import logger from "./monitoring/logger"

const setup = (app: Express) => {
    app.use(`${config.app.basePath}/api`, async (req: Request, res: Response) => {
        try {
            console.log(`${req.method}: ${req.path}`)

            const path = `${config.app.apiUrl}${req.path}`

            console.log(path)

            fetch(path, {}).then(
                    (response) => {
                        logger.info("onsuccess")
                        res.send(response)
                    },
                    (error) => {
                        logger.error("onfailure")
                        res.send(error)
                    },
            )
        } catch (e) {
            console.log("Feilmelding: ", e)
            res.status(500).send("Error")
        }
    })
}

export default {
    setup
}
